'use client'

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

	return <div>HomePage</div>
}

export default HomePage
