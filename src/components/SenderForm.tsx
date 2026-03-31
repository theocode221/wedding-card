export type SenderFormProps = {
  senderName: string;
  shortMessage: string;
  onSenderNameChange: (value: string) => void;
  onShortMessageChange: (value: string) => void;
};

export function SenderForm({
  senderName,
  shortMessage,
  onSenderNameChange,
  onShortMessageChange,
}: SenderFormProps) {
  return (
    <section className="congrats-sender" aria-labelledby="sender-heading">
      <span id="sender-heading" className="congrats-sender__label">
        Daripada
      </span>
      <label htmlFor="congrats-sender-name" className="visually-hidden">
        Nama penghantar
      </label>
      <input
        id="congrats-sender-name"
        className="congrats-sender__field"
        type="text"
        autoComplete="name"
        placeholder="Nama anda"
        value={senderName}
        onChange={(e) => onSenderNameChange(e.target.value)}
        maxLength={80}
      />
      <label htmlFor="congrats-sender-note" className="visually-hidden">
        Mesej ringkas pilihan
      </label>
      <textarea
        id="congrats-sender-note"
        className="congrats-sender__field"
        placeholder="Mesej ringkas (pilihan)…"
        value={shortMessage}
        onChange={(e) => onShortMessageChange(e.target.value)}
        maxLength={280}
        rows={3}
      />
    </section>
  );
}
