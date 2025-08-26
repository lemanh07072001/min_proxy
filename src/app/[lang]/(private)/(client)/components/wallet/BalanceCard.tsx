// FILE: BalanceCard.tsx

import { Plus, Wallet } from 'lucide-react'

import { AnimatePresence, motion } from 'framer-motion'

import { useState } from 'react'

// 💡 Import 2 component dialog bạn đã tạo
import RechargeInputDialog from '@/app/[lang]/(private)/(client)/components/wallet/RechargeInputDialog'
import QrCodeDisplayDialog from '@/app/[lang]/(private)/(client)/components/wallet/QrCodeDisplayDialog'

// Interface để định nghĩa cấu trúc dữ liệu giao dịch
interface TransactionData {
  qrUrl: string | null;
  amount: string;
  rechargeAmount: string;
}

interface BalanceCardProps {
  isWalletVisible: boolean,
  isInitialLoad: boolean,
}

export default function BalanceCard({ isWalletVisible, isInitialLoad }: BalanceCardProps) {
  // 1. Thêm state để quản lý việc mở/đóng CẢ HAI dialog
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  // State để lưu thông tin giao dịch và truyền từ dialog nhập sang dialog hiển thị QR
  const [transactionData, setTransactionData] = useState<TransactionData>({
    qrUrl: null,
    amount: '',
    rechargeAmount: '',
  });


  // 2. Thêm hàm xử lý khi QR được tạo từ RechargeInputDialog
  // Hàm này sẽ nhận dữ liệu, đóng dialog nhập và mở dialog hiển thị QR
  const handleGenerateQr = (data: { qrUrl: string; amount: string; rechargeAmount: string }) => {
    setTransactionData(data);
    setIsInputOpen(false); // Đóng dialog nhập liệu
    setIsQrOpen(true);      // Mở dialog hiển thị QR
  };

  return (
    <>
      <AnimatePresence>
        {isWalletVisible && (
          <motion.div
            initial={isInitialLoad ? { opacity: 1, maxHeight: 300 } : { opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: 300 }}
            exit={{ opacity: 0, maxHeight: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden', padding: '0 1rem' }}
          >
            <div className='wallet-card'>
              <div className='wallet-header'>
                <Wallet className='wallet-icon' size={20} />
                <span className='wallet-title'>Ví của bạn</span>
              </div>
              <div className='wallet-balance'>
                <span className='balance-amount'>2,450,000</span>
                <span className='balance-currency'>VNĐ</span>
              </div>
              <div className='wallet-actions'>
                {/* 3. Cập nhật sự kiện click để mở dialog nhập liệu */}
                <button className='btn-primary' onClick={() => setIsInputOpen(true)}>
                  <Plus size={16} />
                  Nạp tiền
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Render 2 component dialog với đầy đủ state và props cần thiết */}
      <RechargeInputDialog
        isOpen={isInputOpen}
        handleClose={() => setIsInputOpen(false)}
        onGenerateQr={handleGenerateQr}
      />

      <QrCodeDisplayDialog
        isOpen={isQrOpen}
        handleClose={() => setIsQrOpen(false)}
        qrDataUrl={transactionData.qrUrl}
        amount={transactionData.amount}
        rechargeAmount={transactionData.rechargeAmount}
      />
    </>
  )
}