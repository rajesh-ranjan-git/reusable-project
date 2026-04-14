import { ChangeEvent, SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LuCreditCard, LuLock, LuShieldCheck, LuUser } from "react-icons/lu";
import { TbLoader3 } from "react-icons/tb";

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
      router.push("/chat");
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8 glass-heavy">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="mb-1 font-bold text-text-primary text-xl">
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
          <div>
            <label className="ml-1 text-xs">Cardholder Name</label>

            <div className="relative">
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 rounded-xl bg-accent-purple-light/40"
              />
              <LuUser
                className="top-1/2 left-4 absolute text-text-secondary -translate-y-1/2"
                size={18}
              />
            </div>
          </div>

          <div>
            <label className="ml-1 text-xs">Card Number</label>
            <div className="relative">
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="pl-10 rounded-xl bg-accent-purple-light/40"
              />
              <LuCreditCard
                className="top-1/2 left-4 absolute text-text-secondary -translate-y-1/2"
                size={18}
              />
            </div>
          </div>

          <div className="gap-4 grid grid-cols-2">
            <div>
              <label className="ml-1 text-xs">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={handleExpiryChange}
                className="rounded-xl text-center bg-accent-purple-light/40"
              />
            </div>
            <div>
              <label className="ml-1 text-xs">CVV</label>
              <input
                type="text"
                placeholder="123"
                value={cvv}
                onChange={handleCvvChange}
                className="rounded-xl text-center bg-accent-purple-light/40"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex justify-center items-center gap-2 py-3 border border-transparent group-hover:border-accent-purple-light rounded-xl w-full font-medium text-text-on-accent transition-all btn btn-primary"
        >
          {loading ? (
            <TbLoader3 size={20} className="animate-spin" />
          ) : (
            <>
              <LuLock size={16} /> Pay Now
            </>
          )}
        </button>

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
