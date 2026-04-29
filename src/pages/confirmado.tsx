// src/pages/confirmado.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import supabase from '../utils/supabase'
import './confirmado.css'

export default function Confirmado() {
    const navigate = useNavigate()
    const location = useLocation()
    const id_pedido = (location.state as { id_pedido?: number })?.id_pedido

    const [posicao, setPosicao] = useState<number | null>(null)
    const [aguardando, setAguardando] = useState(true)

    useEffect(() => {
        if (!id_pedido) return

        let resolvido = false

        function resolver(pos: number) {
        if (resolvido) return
        resolvido = true
        setPosicao(pos)
        setAguardando(false)
        }

        // 1) leitura imediata — pode já ter posição quando a tela abre
        supabase
        .from('pedidos')
        .select('posicao_warehouse')
        .eq('id_pedido', id_pedido)
        .single()
        .then(({ data }) => {
            if (data?.posicao_warehouse != null) resolver(data.posicao_warehouse)
        })

        // 2) realtime — dispara assim que o supervisório escrever
        const channel = supabase
        .channel(`pedido-${id_pedido}`)
        .on(
            'postgres_changes',
            {
            event: 'UPDATE',
            schema: 'public',
            table: 'pedidos',
            filter: `id_pedido=eq.${id_pedido}`,
            },
            (payload) => {
            const nova = payload.new as { posicao_warehouse?: number }
            if (nova.posicao_warehouse != null) resolver(nova.posicao_warehouse)
            }
        )
        .subscribe()

        // 3) polling de fallback — caso realtime falhe por rede
        const poll = setInterval(async () => {
        if (resolvido) return
        const { data } = await supabase
            .from('pedidos')
            .select('posicao_warehouse')
            .eq('id_pedido', id_pedido)
            .single()

        if (data?.posicao_warehouse != null) resolver(data.posicao_warehouse)
        }, 5000)

        return () => {
        supabase.removeChannel(channel)
        clearInterval(poll)
        }
    }, [id_pedido])

    return (
        <div className="confirmado-screen">
        <div className="confirmado-card">
            <h1 className="confirmado-titulo">PEDIDO CONCLUÍDO!</h1>
            <p className="confirmado-texto">
            Seu pedido foi efetuado com sucesso.<br />
            Olhe para as máquinas!!!
            </p>

            {id_pedido && (
            <div className="confirmado-warehouse">
                {aguardando ? (
                <p className="confirmado-aguardando">
                    ⏳ Aguardando posição no warehouse...
                </p>
                ) : (
                <p className="confirmado-posicao">
                    📦 Posição no Warehouse: <strong>{posicao}</strong>
                </p>
                )}
            </div>
            )}
        </div>

        <button className="confirmado-botao" onClick={() => navigate('/')}>
            HOME
        </button>
        </div>
    )
}