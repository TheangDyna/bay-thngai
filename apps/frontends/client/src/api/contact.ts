import axiosInstance from "@/utils/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//
// ─── TYPE DEFINITIONS ─────────────────────────────────────────────────────────
//
export interface ContactRecord {
  _id: string;
  label: string;
  value: string;
}

interface AddContactPayload {
  label: string;
  value: string;
}

interface UpdateContactPayload {
  _id: string;
  label?: string;
  value?: string;
}

//
// ─── FETCH / MUTATION FUNCTIONS ───────────────────────────────────────────────
//
const fetchContacts = async (): Promise<ContactRecord[]> => {
  const { data } = await axiosInstance.get<{
    status: string;
    data: ContactRecord[];
  }>("/auth/me/contacts");
  return data.data;
};

const addContactFn = async (
  payload: AddContactPayload
): Promise<ContactRecord> => {
  const { data } = await axiosInstance.post<{
    status: string;
    data: ContactRecord;
  }>("/auth/me/contacts", payload);
  return data.data;
};

const updateContactFn = async ({
  _id,
  label,
  value
}: UpdateContactPayload): Promise<ContactRecord> => {
  const { data } = await axiosInstance.put<{
    status: string;
    data: ContactRecord;
  }>(`/auth/me/contacts/${_id}`, { label, value });
  return data.data;
};

const deleteContactFn = async (id: string): Promise<{ success: boolean }> => {
  await axiosInstance.delete(`/auth/me/contacts/${id}`);
  return { success: true };
};

//
// ─── REACT QUERY HOOKS ─────────────────────────────────────────────────────────
//
export const useGetContactsQuery = () => {
  return useQuery<ContactRecord[], Error>({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false
  });
};

export const useAddContactMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ContactRecord, Error, AddContactPayload>({
    mutationFn: (newContact) => addContactFn(newContact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    }
  });
};

export const useUpdateContactMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ContactRecord, Error, UpdateContactPayload>({
    mutationFn: (updated) => updateContactFn(updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    }
  });
};

export const useDeleteContactMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (id) => deleteContactFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    }
  });
};
