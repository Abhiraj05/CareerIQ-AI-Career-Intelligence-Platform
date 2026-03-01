import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from './Icon'

export function AccordionItem({ title, children, badge, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <div className="border border-white/[0.07] rounded-xl overflow-hidden hover:border-accent/30 transition-colors duration-300">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full p-5 bg-surface hover:bg-surface2 transition-colors duration-200 text-left"
            >
                <div className="flex items-center gap-3">
                    {badge && (
                        <span className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-xs font-bold text-accent font-display">
                            {badge}
                        </span>
                    )}
                    <span className="font-display font-semibold text-[15px] text-[#e8e8f0]">{title}</span>
                </div>
                <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <Icon name="chevron" size={16} className="text-muted" />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="bg-surface2 border-t border-white/[0.07] p-5">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function Accordion({ items }) {
    return (
        <div className="flex flex-col gap-3">
            {items.map((item, i) => (
                <AccordionItem key={i} {...item} />
            ))}
        </div>
    )
}
