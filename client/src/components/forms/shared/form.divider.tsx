const FormDivider = ({ label }: { label?: string }) => (
  <div className="flex items-center gap-3 py-1">
    <div className="flex-1 bg-border-subtle h-px" />
    {label && (
      <span className="mt-2 font-semibold text-[10px] text-text-muted uppercase tracking-widest">
        {label}
      </span>
    )}
    <div className="flex-1 bg-border-subtle h-px" />
  </div>
);

export default FormDivider;
