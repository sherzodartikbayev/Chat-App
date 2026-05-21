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
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Send, Upload } from 'lucide-react'
import Chat from './chat'

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
				setPlaceholderIndex(p => p + (1 % PLACEHOLDERS.length))
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

		sendMessage({ content: input.trim(), type: 'server', user })
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

	return (
		<div
			className='fixed inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-3'
			onDrop={handleDrop}
			onDragOver={e => {
				e.preventDefault()
				setIsDragging(true)
			}}
			onDragLeave={() => setIsDragging(false)}
		>
			<div className='flex w-full max-w-4xl items-end gap-2 rounded-3xl border border-blue-500 bg-slate-950 px-3 py-2'>
				<Input
					value={input}
					onChange={handleTyping}
					onKeyDown={handleKeydown}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					placeholder={PLACEHOLDERS[placeholderIndex]}
					className='flex-1 bg-transparent text-white border-blue-500'
				/>

				<Input
					ref={uploadInput}
					type='file'
					hidden
					accept='image/jprg, image/png'
					onChange={handleImageUpload}
				/>

				<Button size='icon' onClick={handleSendText}>
					{hasContent ? <Send /> : <Upload />}
				</Button>

				<div className='relative'>
					{hasContent && (
						<div className='absolute bottom-2 -right-2 flex items-center gap-1.5'>
							<div
								className={`transition-colors duration-300 ${chargeCounts > 500 ? 'text-red-400' : 'text-white'}`}
							>
								<p className='text-[10px] font-medium text-2xl'>
									{chargeCounts}
								</p>
							</div>
							{chargeCounts > 0 && (
								<div className='h-1 w-1 rounded-full bg-sky-400 animate-pulse' />
							)}
						</div>
					)}
				</div>

				{!hasContent && !isFocused && (
					<div className='absolute bottom-5 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1.5 rounded-full border border-slate-700/50 bg-slate-900/80 px-2.5 py-1 backdrop-filter animate-pulse'>
						<kbd className='text-[10px] font-medium text-white'>Enter</kbd>
						<span className='text-[10px] text-white'>to send</span>
					</div>
				)}
			</div>
		</div>
	)
}

export default SendMessage
