// Os cases não têm mais página própria (o site não detalha os projetos dos
// clientes). Endereço antigo de um case leva, em definitivo, para a lista.
import { permanentRedirect } from 'next/navigation';

export default function CasePage() {
  permanentRedirect('/cases');
}
