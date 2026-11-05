import { ReactNode } from 'react';
import type { AlertVariant } from './Alert';

interface ConfirmProps {
  variant?: AlertVariant;
  title: string;
  children: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// 상태별 헤더 색상 (Tailwind가 클래스를 감지할 수 있도록 전체 문자열로 작성)
const HEADER_STYLES: Record<AlertVariant, string> = {
  info: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
};

// 확인 버튼 색상
const CONFIRM_STYLES: Record<AlertVariant, string> = {
  info: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
};

export function Confirm({
  variant = 'warning',
  title,
  children,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
}: ConfirmProps) {
  return (
    <div
      role="alertdialog"
      aria-label={title}
      className="w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.12)]"
    >
      {/* 헤더 */}
      <div
        className={`flex items-center justify-between px-4 py-3 text-white ${HEADER_STYLES[variant]}`}
      >
        <h3 className="text-sm font-semibold">{title}</h3>
        <button
          type="button"
          onClick={onCancel}
          aria-label="닫기"
          className="-mr-1 flex h-6 w-6 items-center justify-center rounded-full text-lg leading-none hover:bg-white/25 transition-colors cursor-pointer"
        >
          ×
        </button>
      </div>

      {/* 내용 (배경은 항상 흰색) */}
      <div className="bg-white px-4 py-4 text-sm leading-relaxed text-gray-800">{children}</div>

      {/* 버튼 영역 */}
      <div className="flex justify-end gap-2 bg-white px-4 pb-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:opacity-75 cursor-pointer"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`rounded-lg px-3 py-1.5 text-sm text-white hover:opacity-75 cursor-pointer ${CONFIRM_STYLES[variant]}`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}
