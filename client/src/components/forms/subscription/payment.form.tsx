import { ChangeEvent, SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LuCreditCard, LuLock, LuShieldCheck, LuUser } from "react-icons/lu";
import { chatRoutes } from "@/lib/routes/routes";
import FormField from "@/components/forms/shared/form.field";
import FormButton from "@/components/forms/shared/form.button";
import FormInput from "@/components/forms/shared/form.input";

const PaymentForm = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);

    value = value.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(value);
  };

  const handleExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    if (value.length > 5) value = value.slice(0, 5);
    setExpiry(value);
  };

  const handleCvvChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    setCvv(value);
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(chatRoutes.chat);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8 glass-heavy">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="mb-1 font-arima font-bold text-text-primary text-xl tracking-wide">
            Payment Method
          </h2>
          <p className="text-text-secondary text-sm">
            Enter your credit or debit card details below.
          </p>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl transition-colors cursor-pointer glass-interactive">
          <div className="bg-glass-bg-strong border-4 border-accent-purple-dark rounded-full w-5 h-5 shrink-0"></div>
          <div className="badge badge-gradient">VISA</div>
          <span className="flex-1 -mt-0.5 font-medium text-text-primary text-sm">
            •••• 4242
          </span>
          <span className="text-text-secondary text-xs">12/26</span>
        </div>

        <div className="relative flex items-center">
          <div className="divider-gradient-to-left grow"></div>
          <span className="mx-4 font-semibold text-text-secondary text-xs uppercase tracking-widest shrink-0">
            Or New Card
          </span>
          <div className="divider-gradient-to-right grow"></div>
        </div>

        <div className="space-y-4">
          <FormField label="Cardholder Name" htmlFor="cardholder" required>
            <FormInput
              id="cardholder"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl"
              startIcon={<LuUser size={18} />}
            />
          </FormField>

          <FormField label="Card Number" htmlFor="card-number" required>
            <FormInput
              id="card-number"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={handleCardNumberChange}
              className="rounded-xl"
              startIcon={<LuCreditCard size={18} />}
            />
          </FormField>

          <div className="gap-4 grid grid-cols-2">
            <FormField label="Expiry Date" htmlFor="expiry" required>
              <FormInput
                id="expiry"
                placeholder="MM/YY"
                value={expiry}
                onChange={handleExpiryChange}
                className="rounded-xl text-center"
              />
            </FormField>
            <FormField label="CVV" htmlFor="cvv" required>
              <FormInput
                id="cvv"
                placeholder="123"
                value={cvv}
                onChange={handleCvvChange}
                className="rounded-xl text-center"
              />
            </FormField>
          </div>
        </div>

        <FormButton
          variant="primary"
          loading={loading}
          className="justify-center rounded-xl w-full"
        >
          <LuLock size={16} /> Pay Now
        </FormButton>

        <div className="flex justify-center items-center gap-2 mt-2 text-text-secondary">
          <LuShieldCheck size={16} className="text-status-success-text" />
          <span className="font-medium text-status-success-text text-xs uppercase tracking-wider">
            Secured Payments
          </span>
        </div>
      </div>
    </form>
  );
};

export default PaymentForm;
