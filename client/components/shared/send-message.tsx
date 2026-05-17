import { ChatMessage, User } from '@/types/chat'
import {
	ChangeEvent,
	Dispatch,
	DragEvent,
	FC,
	KeyboardEvent,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import { Socket } from 'socket.io-client'

interface SendMessageProps {
	user: User
	socket: Socket
	setChat: Dispatch<SetStateAction<ChatMessage[]>>
}

const PLACEHOLDERS = [
	'Type your message here...',
	'Share your thoughts...',
	"What's on your mind?",
	'Drop an image or type...',
	'Join the conversation',
]

const SendMessage: FC<SendMessageProps> = ({ socket, setChat, user }) => {
	const [input, setInput] = useState('')
	const [isDragging, setIsDragging] = useState(false)
	const [placeholderIndex, setPlaceholderIndex] = useState(0)
	const [isFocused, setIsFocused] = useState(false)

	const uploadInput = useRef<HTMLInputElement>(null)
	const typingTimeout = useRef<NodeJS.Timeout | null>(null)

	const chargeCounts = input.length
	const hasContent = input.trim().length > 0

	useEffect(() => {
		if (!isFocused && !input) {
			const interval = setInterval(() => {
				setPlaceholderIndex(p => p + 1 / PLACEHOLDERS.length)
			}, 3000)

			return () => clearInterval(interval)
		}
	}, [isFocused, input])

	const emitTyping = useCallback(
		(typing: boolean) => {
			socket.emit('user_typing', { user: user.name, typing })
		},
		[socket, user.name],
	)

	const sendMessage = useCallback(
		(msg: ChatMessage) => {
			setChat(prev => [...prev, msg])
			socket.emit('send_message', msg)
			emitTyping(false)
		},
		[setChat, socket, emitTyping],
	)

	const handleSendText = useCallback(() => {
		if (!hasContent) {
			uploadInput.current?.click()
			return
		}

		sendMessage({ content: input.trim(), type: 'text', user })
		setInput('')
	}, [input, user, hasContent, sendMessage])

	const handleImage = useCallback(
		(file: File) => {
			if (!['image/jpeg', 'image/png'].includes(file.type)) return

			const imageUrl = URL.createObjectURL(file)

			sendMessage({ content: imageUrl, type: 'image', user })
			setTimeout(() => URL.revokeObjectURL(imageUrl), 10000)
		},
		[sendMessage, user],
	)

	const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) handleImage(file)
	}

	const handleDrop = (e: DragEvent<HTMLInputElement>) => {
		e.preventDefault()
		setIsDragging(false)
		const file = e.dataTransfer.files[0]
		if (file) handleImage(file)
	}

	const handleTyping = (e: ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value)
		emitTyping(true)
		if (typingTimeout.current) clearTimeout(typingTimeout.current)

		typingTimeout.current = setTimeout(() => {
			emitTyping(false)
		}, 800)
	}

	const handleKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSendText()
		}
	}

	return <div>SendMessage</div>
}

export default SendMessage
