'use client'

import JoinForm from '@/components/shared/join-form'
import { ChatMessage, User } from '@/types/chat'
import { useEffect, useRef, useState } from 'react'
import { io, type Socket } from 'socket.io-client'

const socket: Socket = io(process.env.NEXT_PUBLIC_SERVER_URL, {
	autoConnect: true,
})

const HomePage = () => {
	const [chat, setChat] = useState<ChatMessage[]>([])
	const [typing, setTyping] = useState<string[]>([])
	const [input, setInput] = useState('')

	const userRef = useRef<User | null>(null)

	useEffect(() => {
		const handleReceiveMessage = (message: ChatMessage) => {
			if (!userRef.current) return
			setChat(prev => [...prev, message])
		}

		const handleUserTyping = (data: { user: string; typing: boolean }) => {
			if (!userRef.current) return
			setTyping(prev => {
				if (data.typing) {
					return prev.includes(data.user) ? prev : [...prev, data.user]
				}
				return prev.filter(u => u !== data.user)
			})
		}

		const handleNewUser = (newUser: string) => {
			if (!userRef.current) return
			setChat(prev => [
				...prev,
				{ content: `${newUser} joined`, type: 'server' },
			])
		}

		socket.on('recieve_message', handleReceiveMessage)
		socket.on('user_typing', handleUserTyping)
		socket.on('new_user', handleNewUser)

		return () => {
			socket.off('recieve_message', handleReceiveMessage)
			socket.off('user_typing', handleUserTyping)
			socket.off('new_user', handleNewUser)
		}
	}, [])

	const hasUser = Boolean(userRef.current)

	console.log(hasUser)

	return (
		<main className='relative h-screen w-full overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-3 md:px-6'>
			<div className='pointer-events-none absolute inset-0 overflow-hidden'>
				<div className='absolute -top-40 -left-32 h-80 w-80 rounded-full bg-sky-500/20 blur-xl animate-pulse' />
				<div className='absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl animate-[pulse_3s_ease-in-out_infinite]' />
			</div>

			<div className='relative z-10 flex h-full w-full max-w-6xl flex-col'>
				{hasUser ? (
					<p>User</p>
				) : (
					<JoinForm
						user={userRef}
						socket={socket}
						input={input}
						setInput={setInput}
					/>
				)}
			</div>
		</main>
	)
}

export default HomePage
