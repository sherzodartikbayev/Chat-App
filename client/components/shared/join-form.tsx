'use client'

import { User } from '@/types/chat'
import { UserPlus } from 'lucide-react'
import {
	ChangeEvent,
	Dispatch,
	KeyboardEvent,
	RefObject,
	SetStateAction,
	useCallback,
} from 'react'
import { Socket } from 'socket.io-client'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

interface JoinFormProps {
	user: RefObject<User | null>
	socket: Socket
	input: string
	setInput: Dispatch<SetStateAction<string>>
}

const JoinForm = ({ input, setInput, socket, user }: JoinFormProps) => {
	const addUser = useCallback(() => {
		const name = input.trim()
		if (!name || !socket.connected) return

		user.current = {
			id: socket.id ?? crypto.randomUUID(),
			name,
		}

		socket.emit('new_user', { user: name })
		setInput('')
	}, [input, socket, setInput, user])

	const handleChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setInput(e.target.value)
		},
		[setInput],
	)

	const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			addUser()
		}
	}, [])

	return (
		<div className='relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4 py-8'>
			<div className='relative z-10 flex w-full max-w-5xl flex-col gap-10 md:flex-row md:items-center md:justify-between'>
				{/* Left */}
				<div className='space-y-6 text-center md:text-left md:w-1/2'>
					<h1 className='bg-linear-to-br from-sky-300 via-white to-violet-300 bg-clip-text text-4xl font-semibold text-transparent sm:text-5xl md:text-6xl'>
						Join the conversation
					</h1>
					<p className='max-w-md text-sm text-slate-300/80'>
						Pick a name and start chatting in real time.
					</p>

					<div className='relative mx-auto max-w-xs md:mx-0'>
						<div className='relative rounded-3xl border border-sky-500/30 bg-slate-900/60 p-4 shadow-xl backdrop-blur'>
							<div className='flex items-center gap-3'>
								<div className='relative h-12 w-12 rounded-2xl bg-linear-to-tr from-sky-400 to-violet-500'>
									<UserPlus className='size-full p-2.5' />
								</div>
								<p className='text-sm text-slate-200'>
									New people joining live
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Right */}
				<div className='md:w-95 w-full'>
					<Card className='border-slate-700 bg-slate-900/80 text-slate-50 backdrop-blur'>
						<CardHeader>
							<CardTitle>Enter the chat</CardTitle>
							<CardDescription>Choose a display name</CardDescription>
						</CardHeader>

						<CardContent className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='display-name'>Display name</Label>
								<Input
									id='display-name'
									value={input}
									onChange={handleChange}
									onKeyDown={handleKeyDown}
									autoFocus
									autoComplete='off'
								/>
							</div>
						</CardContent>

						<CardFooter>
							<Button
								onClick={addUser}
								disabled={!input.trim() || !socket.connected}
								className='w-full'
							>
								Join chat
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	)
}

export default JoinForm
