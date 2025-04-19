import { useRouter } from "expo-router";

export enum AuthScreens {
  WELCOME = "(auth)/",
  LOGIN = "(auth)/login",
  REGISTER = "(auth)/register",
  ONBOARDING = "(auth)/onboarding",
}

export const useAuthNavigation = () => {
  const router = useRouter();

  const navigateTo = (screen: AuthScreens) => {
    router.push(screen as any);
  };

  return {
    navigateTo,
    goToWelcome: () => navigateTo(AuthScreens.WELCOME),
    goToLogin: () => navigateTo(AuthScreens.LOGIN),
    goToRegister: () => navigateTo(AuthScreens.REGISTER),
    goToOnboarding: () => navigateTo(AuthScreens.ONBOARDING),
  };
};
