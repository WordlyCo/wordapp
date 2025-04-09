from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional, TypeVar, Generic, List
from humps import camelize

T = TypeVar("T")
ItemType = TypeVar("ItemType")


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=camelize, populate_by_name=True)


class BaseEntity(CamelModel):
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class PageInfo(CamelModel):
    page: int = Field(..., description="Current page number")
    per_page: int = Field(..., description="Number of items per page")
    total_items: int = Field(..., description="Total number of items available")
    total_pages: int = Field(..., description="Total number of pages")


class PaginatedData(CamelModel, Generic[ItemType]):
    items: List[ItemType] = Field(..., description="List of items on the current page")
    page_info: PageInfo = Field(..., description="Pagination details")


class Response(CamelModel, Generic[T]):
    success: bool
    message: str
    error_code: Optional[str] = None
    data: Optional[T] = None
