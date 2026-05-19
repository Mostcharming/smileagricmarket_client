import { AdminKycDetailsResponse } from "./admin.types";
import { SelectOptions } from "./shared.types";

export interface SelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "value"> {
  variant?: "v1" | "v2";
  className?: string;
  options?: SelectOptions[];
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
  placeholder?: string;
  emptyState?: string;
  defaultValue?: string;
  dropdownPosition?: "left" | "right";
  minWidth?: string | number;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadMoreLabel?: string;
  loadMoreLoading?: boolean;
  label?: string;
  labelClassName?: string;
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
  prefix?: React.ReactNode;
  prefixClassName?: string;
  bottomText?: string;
  bottomClassName?: string;
  as?: 'input' | 'textarea';
  rows?: number;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'light' | 'dark' | 'primary';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  isLoading?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
  maxWidth?: string;
  maxHeight?: string;
  bottomRight?: boolean;
  closeOnOverlayClick?: boolean;
}

export interface KycModalProps {
  isOpen: boolean;
  onClose: () => void;
  number: string;
  setNumber: (number: string) => void;
  identification: string;
  setIdentification: (identification: string) => void;
  identificationOptions: SelectOptions[];
  photo: File | null;
  setPhoto?: (photo: File | null) => void;
  isPending?: boolean;
  onDone: () => void;
}

export interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminKycDetailsResponse | null;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  isPending?: boolean;
}