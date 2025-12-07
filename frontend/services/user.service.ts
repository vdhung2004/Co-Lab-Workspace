type UserProfileUpdateRequest = {
  fullName?: string;
  phone?: string;
};

type UserProfileUpdateResponse = {
  success: boolean;
  message: string;
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

export async function updateProfileAPI(
  data: UserProfileUpdateRequest
): Promise<UserProfileUpdateResponse> {
  try {
    const res = await fetch("http://localhost:5000/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const responseData = await res.json();
      return {
        success: true,
        message: responseData.message,
        user: responseData.user,
      };
    } else {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.message || "Cập nhật hồ sơ thất bại",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}
type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};
type ChangePasswordResponse = {
  success: boolean;
  message: string;
};

export async function changePasswordAPI(
  data: ChangePasswordRequest
): Promise<ChangePasswordResponse> {
  try {
    const res = await fetch("http://localhost:5000/api/users/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const responseData = await res.json();
      return {
        success: true,
        message: responseData.message,
      };
    } else {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.message || "Đổi mật khẩu thất bại",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}
