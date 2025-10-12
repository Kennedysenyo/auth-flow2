import { AuthForm } from "@/components/auth/AuthForm/AuthForm";
import styles from "./login.module.css";

export default function LoginPage() {
  return (
    <div className={`${styles.flex}`}>
      <AuthForm type="login" />
    </div>
  );
}
