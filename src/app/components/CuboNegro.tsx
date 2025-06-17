'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  db,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  getCountFromServer
} from '../lib/firebase';

interface Pulse {
  id: string;
  createdAt: number;
}

export default function CuboNegro() {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [count, setCount] = useState(0);
  const loadedInitial = useRef(false);
  const pulseIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const loadCount = async () => {
      const coll = collection(db, 'pulses');
      const snapshot = await getCountFromServer(coll);
      setCount(snapshot.data().count);
    };
    loadCount();

    const q = query(collection(db, 'pulses'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!loadedInitial.current) {
        loadedInitial.current = true;
        setCount(snapshot.size);
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const doc = change.doc;
          const id = doc.id;
          const createdAt = doc.data().createdAt?.toDate?.().getTime?.() ?? Date.now();

          if (pulseIds.current.has(id)) return; // evitar duplicata
          pulseIds.current.add(id);

          const pulse: Pulse = { id, createdAt };
          setPulses((prev) => {
            const newPulses = [...prev, pulse].slice(-5); // manter no máx 5 simultâneos
            return newPulses;
          });

          setCount((prev) => prev + 1);

          setTimeout(() => {
            setPulses((prev) => prev.filter((p) => p.id !== id));
            pulseIds.current.delete(id);
          }, 1200);
        }
      });
    });

    return () => unsubscribe();
  }, []);

  const handleClick = async () => {
    await addDoc(collection(db, 'pulses'), {
      createdAt: new Date()
    });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white relative">
      <AnimatePresence>
        {pulses.map((pulse) => (
          <motion.div
            key={pulse.id}
            initial={{ scale: 1, opacity: 0.4 }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.2] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute w-60 h-60 bg-black blur-md"
          />
        ))}
      </AnimatePresence>

      <motion.div
        onClick={handleClick}
        whileTap={{ scale: 1.2 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-60 h-60 bg-black cursor-pointer relative z-10"
      >
        <span className="absolute -bottom-5 right-2 text-gray-600 text-xs font-mono tracking-widest drop-shadow-[0_0_2px_rgba(255,191,0,0.7)]">
          {count}
        </span>
      </motion.div>
    </div>
  );
}
