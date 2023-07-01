import { buttonVariants } from "@/components/ui/Button";
import { toast } from "./use-toast";
import Link from "next/link";

export const useCustomToast = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: "Login required",
      description: "You must be logged in to do that",
      variant: "destructive",
      action: (
        <Link
          href="/sign-in"
          className={buttonVariants({ variant: "outline" })}
          onClick={() => dismiss()}
        >
          Login
        </Link>
      ),
    });
  };

  return { loginToast };
};
