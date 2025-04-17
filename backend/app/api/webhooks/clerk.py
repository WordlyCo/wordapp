from fastapi import APIRouter, Request, Depends, Response
from app.models.user import UserCreate
from app.services.users import get_user_service, UserService, UserAlreadyExistsError
import json
import logging
import traceback

logger = logging.getLogger("clerk_webhook")
logger.setLevel(logging.INFO)

router = APIRouter()


@router.post("/clerk")
async def clerk_webhook(
    request: Request,
    response: Response,
    user_service: UserService = Depends(get_user_service),
):

    try:
        body = await request.body()
        body_text = body.decode()
        event_type = None

        try:
            payload = json.loads(body_text)
            event_type = payload.get("type")
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse webhook JSON: {str(e)}")
            payload = {}

        if event_type == "user.created":
            data = payload.get("data", {})
            user_id = data.get("id")

            if not user_id:
                logger.error("No user ID found in payload")
                response.status_code = 400
                return {"status": "error", "message": "No user ID in payload"}

            logger.info(f"User data from Clerk: {json.dumps(data)}")

            email_addresses = data.get("email_addresses", [])
            email = None
            if email_addresses and len(email_addresses) > 0:
                email = email_addresses[0].get("email_address")

            if not email:
                logger.error("No email found in payload")
                response.status_code = 400
                return {"status": "error", "message": "No email found in payload"}

            first_name = data.get("first_name", "")
            last_name = data.get("last_name", "")
            username = data.get("username")

            logger.info(
                f"Creating user with: clerk_id={user_id}, email={email}, "
                + f"username={username}, first_name={first_name}, last_name={last_name}"
            )

            db_user = UserCreate(
                clerk_id=user_id,
                email=email,
                username=username,
                first_name=first_name,
                last_name=last_name,
            )

            try:
                created_user = await user_service.create_user(db_user)
                logger.info(
                    f"Successfully created user in database: ID={created_user.id}"
                )
                return {
                    "status": "success",
                    "message": "User created",
                    "user_id": created_user.id,
                }
            except UserAlreadyExistsError as e:
                logger.warn(f"User already exists error: {str(e)}")
                return {"status": "success", "message": "User already exists"}
            except Exception as e:
                logger.error(f"Database error creating user: {str(e)}")
                logger.error(traceback.format_exc())
                response.status_code = 500
                return {
                    "status": "error",
                    "message": f"Failed to create user: {str(e)}",
                }

        return {"status": "success", "message": f"Event {event_type} processed"}
    except Exception as e:
        response.status_code = 500
        return {"status": "error", "message": str(e)}
