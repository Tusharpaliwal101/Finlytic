import { useState } from 'react';
import { usePolicyStore } from '../store/policyStore';
import { useAuthStore } from '../store/authStore';

interface PolicyPayload {
  name: string;
  description: string;
  type: string;
  data: Record<string, unknown>;
}

export function useSavePolicy() {
  const { savePolicy } = usePolicyStore();
  const { user } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pending, setPending] = useState<PolicyPayload | null>(null);

  /** Call this when the user clicks "Save as Policy" — opens the modal */
  const openSaveModal = (payload: PolicyPayload) => {
    setPending(payload);
    setModalOpen(true);
  };

  /** Called by the modal's Save button with the (possibly edited) name */
  const confirmSave = async (customName: string) => {
    if (!pending) return;
    const today = new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
    await savePolicy(
      {
        name: customName,
        description: pending.description,
        type: pending.type,
        data: pending.data,
        effectiveDate: today,
      },
      user?.id
    );
    setModalOpen(false);
    setPending(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const cancelSave = () => {
    setModalOpen(false);
    setPending(null);
  };

  return {
    openSaveModal,
    confirmSave,
    cancelSave,
    modalOpen,
    pendingName: pending?.name ?? '',
    pendingDescription: pending?.description ?? '',
    saved,
  };
}
