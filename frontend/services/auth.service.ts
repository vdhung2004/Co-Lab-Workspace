export type RegisterRequest = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
};
export type LoginResponse = {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    verified: boolean;
  };
};
export type LoginRequest = {
  email: string;
  password: string;
};
export type UserProfileResponse = {
  suscess: boolean;
  message: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    verified: boolean;
  };
};

export async function registerAPI(
  data: RegisterRequest
): Promise<RegisterResponse> {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const data: RegisterResponse = await res.json();

      return {
        success: true,
        message: data.message,
        user: data.user,
      };
    } else {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.message,
      };
    }
  } catch (error: any) {
    console.error("Lỗi khi gọi API đăng ký:", error);
    return {
      success: false,
      message: "Lỗi khi gọi API đăng ký" + error.toString(),
    };
  }
}

export async function loginAPI(data: LoginRequest): Promise<LoginResponse> {
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        message: data.message,
        user: data.user,
      };
    } else {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.message,
      };
    }
  } catch (error: any) {
    console.error("Lỗi khi gọi API đăng nhập:", error);
    return {
      success: false,
      message: "Lỗi khi gọi API đăng nhập" + error.toString(),
    };
  }
}
export async function logoutAPI(): Promise<void> {
  try {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Lỗi khi gọi API đăng xuất:", error);
  }
}
export async function getProfileAPI(): Promise<UserProfileResponse> {
  try {
    const res = await fetch("http://localhost:5000/api/users/profile", {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      const data: UserProfileResponse = await res.json();
      console.log("User profile data:", data);
      return {
        suscess: true,
        message: data.message,
        user: data.user,
      };
    } else {
      throw new Error("Failed to fetch user profile");
    }
  } catch (error) {
    console.error("Lỗi khi gọi API lấy thông tin người dùng:", error);
    throw error;
  }
}

type VerifyEmailResponse = {
  success: boolean;
  message: string;
};
export async function verifyEmailAPI(
  token: string
): Promise<VerifyEmailResponse> {
  try {
    const res = await fetch(`http://localhost:5000/api/auth/verify/${token}`);

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        message: data.message,
      };
    } else {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.message,
      };
    }
  } catch (error: any) {
    console.error("Lỗi khi gọi API xác thực email:", error);
    return {
      success: false,
      message: "Lỗi khi gọi API xác thực email" + error.toString(),
    };
  }
}

type ForgotPasswordResponse = {
  success: boolean;
  message: string;
};

export async function sendForgotPasswordEmailAPI(
  email: string
): Promise<ForgotPasswordResponse> {
  try {
    const res = await fetch(
      "http://localhost:5000/api/auth/send-password-reset-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        message: data.message,
      };
    } else {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.message,
      };
    }
  } catch (error: any) {
    console.error("Lỗi khi gọi API quên mật khẩu:", error);
    return {
      success: false,
      message: "Lỗi khi gọi API quên mật khẩu" + error.toString(),
    };
  }
}

export type ResetPasswordRequest = {
  newPassword: string;
  token: string;
};

export async function resetPasswordAPI(
  data: ResetPasswordRequest
): Promise<ForgotPasswordResponse> {
  console.log("Resetting password with token:", data);
  try {
    const res = await fetch(`http://localhost:5000/api/auth/reset-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const resData = await res.json();
      return {
        success: true,
        message: resData.message,
      };
    } else {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.message,
      };
    }
  } catch (error: any) {
    console.error("Lỗi khi gọi API đặt lại mật khẩu:", error);
    return {
      success: false,
      message: "Lỗi khi gọi API đặt lại mật khẩu" + error.toString(),
    };
  }
}
