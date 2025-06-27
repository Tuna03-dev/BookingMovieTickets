import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Film,
  ArrowRight,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import authAPI from "@/services/auth/authAPI";
interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterRequest>({
    mode: "onChange",
  });

  const passwordValue = watch("password");
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      const registerData: RegisterRequest = {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
      };
      const response = await authAPI.register(registerData);
      if (response) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(
        typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as { response?: { data?: unknown } }).response?.data ===
            "string"
          ? (error as { response: { data: string } }).response.data
          : "Đăng ký thất bại. Vui lòng thử lại sau."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-5"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-red-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-500"></div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <Film className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Đăng ký tài khoản
          </h1>
          <p className="text-gray-400">
            Tạo tài khoản để đặt vé xem phim dễ dàng hơn
          </p>
        </div>

        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800 shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-white">
              Tạo tài khoản mới
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Vui lòng điền đầy đủ thông tin để đăng ký tài khoản
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="FullName" className="text-gray-300">
                  Họ và tên
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="FullName"
                    type="text"
                    placeholder="Nhập họ và tên"
                    {...register("fullName", {
                      required: "Họ và tên là bắt buộc",
                      minLength: {
                        value: 2,
                        message: "Họ và tên phải có ít nhất 2 ký tự",
                      },
                      pattern: {
                        value: /^[a-zA-ZÀ-ỹ\s]+$/,
                        message:
                          "Họ và tên chỉ được chứa chữ cái và khoảng trắng",
                      },
                    })}
                    className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500/20 ${
                      errors.fullName ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <span className="text-xs text-red-400">
                    {errors.fullName.message}
                  </span>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="Email" className="text-gray-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="Email"
                    type="email"
                    placeholder="Nhập email"
                    {...register("email", {
                      required: "Email là bắt buộc",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email không hợp lệ",
                      },
                    })}
                    className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500/20 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <span className="text-xs text-red-400">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Phone Number Field */}
              <div className="space-y-2">
                <Label htmlFor="PhoneNumber" className="text-gray-300">
                  Số điện thoại
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="PhoneNumber"
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    {...register("phoneNumber", {
                      required: "Số điện thoại là bắt buộc",
                      pattern: {
                        value: /^\d{9,11}$/,
                        message: "Số điện thoại không hợp lệ (9-11 chữ số)",
                      },
                    })}
                    className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500/20 ${
                      errors.phoneNumber ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.phoneNumber && (
                  <span className="text-xs text-red-400">
                    {errors.phoneNumber.message}
                  </span>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="Password" className="text-gray-300">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tạo mật khẩu mạnh"
                    {...register("password", {
                      required: "Mật khẩu là bắt buộc",
                      minLength: {
                        value: 8,
                        message: "Mật khẩu phải từ 8 ký tự",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                        message:
                          "Mật khẩu phải gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
                      },
                    })}
                    className={`pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500/20 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-xs text-red-400">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Password Strength Indicator */}
              {passwordValue && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-400">Độ mạnh mật khẩu:</div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded ${
                          getPasswordStrength(passwordValue) >= level
                            ? level <= 2
                              ? "bg-red-500"
                              : level === 3
                              ? "bg-yellow-500"
                              : "bg-green-500"
                            : "bg-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-400">
                    {getPasswordStrengthText(
                      getPasswordStrength(passwordValue)
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang tạo tài khoản...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Đăng ký
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Đã có tài khoản?{" "}
                  <Link
                    to="/login"
                    className="text-red-400 hover:text-red-300 font-semibold transition-colors"
                  >
                    Đăng nhập
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2024 CinemaTickets. Đã đăng ký bản quyền.</p>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getPasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;
  return Math.min(strength, 4);
}

function getPasswordStrengthText(strength: number): string {
  switch (strength) {
    case 0:
    case 1:
      return "Rất yếu";
    case 2:
      return "Yếu";
    case 3:
      return "Tốt";
    case 4:
      return "Mạnh";
    default:
      return "";
  }
}
