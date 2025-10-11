import { AuthForm } from "@/components/Header/auth/AuthForm/AuthForm";
import styles from "./signup.module.css";

export default function SignUpPage() {
  return (
    <div className={`${styles.flex}`}>
      <AuthForm type="signup" />
    </div>
  );
}
