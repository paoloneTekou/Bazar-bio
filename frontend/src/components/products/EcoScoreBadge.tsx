import React from 'react';
import { EcoScoreGrade } from '@/types';
import { LeafIcon } from '@/components/ui/Icons';

interface EcoScoreBadgeProps {
  grade: EcoScoreGrade;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export function EcoScoreBadge({ grade, size = 'sm', showDetails = false }: EcoScoreBadgeProps) {
  const gradeStyles = {
    A: {
      bg: 'bg-[#E5EDE6]',
      text: 'text-[#2D4732]',
      border: 'border-[#A3C0A6]',
      label: 'Exemplaire',
      iconColor: 'text-[#3A5A40]',
    },
    B: {
      bg: 'bg-[#FEF3C7]',
      text: 'text-[#92400E]',
      border: 'border-[#FCD34D]',
      label: 'Très Bon',
      iconColor: 'text-[#D97706]',
    },
    C: {
      bg: 'bg-[#F3F4F6]',
      text: 'text-[#4B5563]',
      border: 'border-[#E5E7EB]',
      label: 'Standard',
      iconColor: 'text-[#6B7280]',
    },
  };

  const style = gradeStyles[grade] || gradeStyles.A;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${style.bg} ${style.text} ${style.border} ${sizeClasses[size]}`}
      title={`Eco-Score ${grade} : Empreinte carbone minimale et zéro pesticide`}
    >
      <LeafIcon className={`w-3 h-3 ${style.iconColor}`} />
      <span>Score <strong>{grade}</strong></span>
      {showDetails && <span className="opacity-75 text-[10px]">({style.label})</span>}
    </span>
  );
}
