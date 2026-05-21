import { UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ServerMessage {
	content: string
}

const ServerMessage = ({ content }: ServerMessage) => {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		setIsVisible(true)
	}, [])

	return (
		<div
			className={`flex items-center justify-center px-2 py-3 md:px-4 md:py-4 transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
		>
			<div className='group relative flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-900/60 px-4 py-2 backdrop-blur-sm shadow-lg'>
				<div className='absolute -inset-1 rounded-full bg-linear-to-r from-emerald-500/20 via-cyan-400/20 to-sky-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity animate-pulse' />

				<div className='relative z-10 flex items-center gap-2.5'>
					<div className='relative'>
						<div className='absolute -inset-1 rounded-full bg-emerald-500/30 blur-sm animate-ping' />

						<div className='relative flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-tr from-emerald-500 to-cyan-500 shadow-md md:h-9 md:w-9'>
							<UserPlus
								width={24}
								height={24}
								className='h-5 w-5 md:h-6 md:w-6'
							/>
						</div>
					</div>
				</div>

				<span className='text-xs font-medium text-slate-300 md:text-sm'>
					{content}
				</span>
			</div>
		</div>
	)
}

export default ServerMessage
