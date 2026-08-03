interface Props {
  onClick: () => void;
}

export default function AddEXButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[#3588d4] cursor-pointer font-bold self-start"
    >
      + Adicionar exercício
    </button>
  );
}