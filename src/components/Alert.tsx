import { ReactNode } from 'react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

// 상태별 헤더 색상 (Tailwind가 클래스를 감지할 수 있도록 전체 문자열로 작성)
const HEADER_STYLES: Record<AlertVariant, string> = {
  info: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
};

export function Alert({ variant = 'info', title, children, onClose }: AlertProps) {
  return (
    <div
      role="alert"
      className="w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.12)]"
    >
      {/* 헤더 */}
      <div
        className={`flex items-center justify-between px-4 py-3 text-white ${HEADER_STYLES[variant]}`}
      >
        <h3 className="text-sm font-semibold">{title}</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="-mr-1 flex h-6 w-6 items-center justify-center rounded-full text-lg leading-none hover:bg-white/25 transition-colors cursor-pointer"
        >
          ×
        </button>
      </div>

      {/* 내용 (배경은 항상 흰색) */}
      <div className="bg-white px-4 py-4 text-sm leading-relaxed text-gray-800">{children}</div>
    </div>
  );
}
