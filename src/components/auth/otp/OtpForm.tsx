import styles from "./opt-form.module.css";

export const OtpForm = () => {
  return (
    <div className={`${styles.otpContainer}`}>
      <h2>Verify OTP code</h2>
      <form>
        <div>
          <label>OTP has been sent to your email</label>
          <input type="text" name="otp" id="otp" placeholder="Enter OTP here" />
          <small></small>
        </div>
        <button>Verify</button>
      </form>
    </div>
  );
};
