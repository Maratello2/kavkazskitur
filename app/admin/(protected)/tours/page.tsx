import { redirect } from 'next/navigation';

export default function AdminToursPage() {
  redirect('/admin?tab=tours');
}
