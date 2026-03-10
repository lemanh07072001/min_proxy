'use client'

import React, { useRef, useState, useEffect } from 'react'

import { X, ShoppingCart, Loader, AlertTriangle, Tag, Clock, CheckCircle } from 'lucide-react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'

import QuantityControl from '@components/form/input-quantity/QuantityControl'
import ProtocolSelector from '@components/form/protocol-selector/ProtocolSelector'
import { subtractBalance } from '@/store/userSlice'
import type { AppDispatch, RootState } from '@/store'
import useAxiosAuth from '@/hocs/useAxiosAuth'

import './styles.css'

export interface PriceOption {
  key: string
  label: string
  price: number
}

interface CheckoutModalProps {
  open: boolean
  onClose: () => void
  productName: string
  productType: 'static' | 'rotating'
  serviceTypeId: number
  priceOptions: PriceOption[]
  protocols: string[]
  ipVersion?: string
  proxyType?: string
  country?: string
  extraPayload?: Record<string, any>
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  open,
  onClose,
  productName,
  productType,
  serviceTypeId,
  priceOptions,
  protocols,
  ipVersion,
  proxyType,
  country,
  extraPayload
}) => {
  const [selectedDuration, setSelectedDuration] = useState(priceOptions[0]?.key || '1')
  const [selectedProtocol, setSelectedProtocol] = useState(protocols[0] || 'http')
  const [quantity, setQuantity] = useState(1)
  const [discountCode, setDiscountCode] = useState('')
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const queryClient = useQueryClient()
  const axiosAuth = useAxiosAuth()
  const { sodu } = useSelector((state: RootState) => state.user)
  const isSubmitting = useRef(false)

  // Reset state khi options thay đổi (product khác)
  useEffect(() => {
    setSelectedDuration(priceOptions[0]?.key || '1')
    setSelectedProtocol(protocols[0] || 'http')
    setQuantity(1)
    setDiscountCode('')
    setPurchaseSuccess(false)
    isSubmitting.current = false
  }, [priceOptions, protocols])

  // Reset success state khi modal mở lại
  useEffect(() => {
    if (open) {
      setPurchaseSuccess(false)
      isSubmitting.current = false
    }
  }, [open])

  const selectedOption = priceOptions.find(p => p.key === selectedDuration) || priceOptions[0]
  const unitPrice = selectedOption?.price || 0
  const total = unitPrice * quantity
  const isBalanceSufficient = sodu >= total

  const calculateDiscount = (key: string, price: number) => {
    if (priceOptions.length <= 1) return null
    const sorted = [...priceOptions].sort((a, b) => parseInt(a.key) - parseInt(b.key))
    const base = sorted[0]
    const baseDays = parseInt(base.key) || 1
    const basePrice = base.price

    if (!basePrice) return null
    const currentDays = parseInt(key) || 0

    if (!currentDays) return null
    const originalPrice = (basePrice / baseDays) * currentDays

    if (price >= originalPrice) return null
    const pct = (1 - price / originalPrice) * 100

    
return pct > 0 ? Math.round(pct) : null
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (orderData: any) => {
      const endpoint = productType === 'static' ? '/buy-proxy-static' : '/buy-proxy-rotating'

      return axiosAuth.post(endpoint, orderData)
    },
    onSuccess: (data) => {
      isSubmitting.current = false

      if (data.data.success === false) {
        toast.error('Lỗi hệ thống, xin vui lòng liên hệ Admin.')
      } else {
        setPurchaseSuccess(true)
        dispatch(subtractBalance(total))
        toast.success(data.data.message || 'Mua proxy thành công.')

        const queryKey = productType === 'static' ? 'orderProxyStatic' : 'proxyData'

        queryClient.invalidateQueries({ queryKey: [queryKey] })
        queryClient.invalidateQueries({ queryKey: ['userOrders'] })

        // Reset sau 2s để khách có thể mua tiếp
        setTimeout(() => {
          setPurchaseSuccess(false)
        }, 2000)
      }
    },
    onError: (error: any) => {
      isSubmitting.current = false
      toast.error(error.response?.data?.message || 'Lỗi không xác định')
    }
  })

  const handlePurchase = () => {
    if (!isBalanceSufficient || isSubmitting.current || isPending || purchaseSuccess) return
    isSubmitting.current = true

    const orderData: any = {
      serviceTypeId,
      quantity,
      protocol: selectedProtocol,
      days: selectedDuration,
      total,
      ...(productType === 'static' && {
        price: unitPrice,
        ip_version: ipVersion,
        proxy_type: proxyType,
        country,
        isPrivate: 'true'
      }),
      ...(productType === 'rotating' && {
        time: selectedDuration,
        ...extraPayload
      })
    }

    mutate(orderData)
  }

  const handleApplyDiscount = () => {
    toast.info('Tính năng đang phát triển')
  }

  if (!open) return null

  return (
    <div className='checkout-overlay' onClick={() => !isPending && onClose()}>
      <div className='checkout-modal' onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className='checkout-header'>
          <h2 className='checkout-title'>
            <ShoppingCart size={20} />
            Thanh Toán
          </h2>
          <button type='button' className='checkout-close' onClick={onClose} disabled={isPending}>
            <X size={20} />
          </button>
        </div>

        <div className='checkout-body'>
          <p className='checkout-product-name'>{productName} <span style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8' }}>#{serviceTypeId}</span></p>

          {/* Duration selector */}
          {priceOptions.length > 1 && (
            <div className='checkout-section'>
              <label className='checkout-section-label'>
                <Clock size={16} />
                THỜI GIAN
              </label>
              <div className='checkout-duration-options'>
                {priceOptions.map((option) => {
                  const discount = calculateDiscount(option.key, option.price)

                  
return (
                    <label
                      key={option.key}
                      className={`checkout-duration-option ${selectedDuration === option.key ? 'active' : ''}`}
                    >
                      <input
                        type='radio'
                        value={option.key}
                        checked={selectedDuration === option.key}
                        onChange={() => setSelectedDuration(option.key)}
                      />
                      <span>{option.label}</span>
                      {discount !== null && discount > 0 && (
                        <span className='duration-discount'>-{discount}%</span>
                      )}
                    </label>
                  )
                })}
              </div>
            </div>
          )}

          {/* Protocol selector */}
          {protocols.length > 1 && (
            <div className='checkout-section'>
              <ProtocolSelector
                protocols={protocols}
                selectedProtocol={selectedProtocol}
                onProtocolChange={setSelectedProtocol}
                label='GIAO THỨC'
              />
            </div>
          )}

          {/* Price + Quantity table */}
          <div className='checkout-price-table'>
            <div className='price-table-header'>
              <span>Giá</span>
              <span>Số lượng</span>
              <span>Thành tiền</span>
            </div>
            <div className='price-table-row'>
              <span className='price-cell'>{unitPrice.toLocaleString('vi-VN')}đ</span>
              <div className='qty-cell'>
                <QuantityControl
                  min={1}
                  max={100}
                  value={quantity}
                  onChange={setQuantity}
                />
              </div>
              <span className='subtotal-cell'>{total.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          {/* Discount code */}
          <div className='checkout-discount'>
            <div className='discount-input-wrapper'>
              <Tag size={16} className='discount-icon' />
              <input
                type='text'
                placeholder='Mã giảm giá'
                value={discountCode}
                onChange={e => setDiscountCode(e.target.value)}
                className='discount-input'
              />
            </div>
            <button type='button' className='discount-btn' onClick={handleApplyDiscount}>
              Áp dụng
            </button>
          </div>

          {/* Order summary */}
          <div className='checkout-summary'>
            {ipVersion && (
              <div className='summary-row'>
                <span className='summary-label'>Loại IP:</span>
                <span className='summary-value'>
                  {productType === 'rotating' ? 'Rotating' : 'Static'} {ipVersion?.toUpperCase()} {country || ''}
                </span>
              </div>
            )}
            <div className='summary-row'>
              <span className='summary-label'>Thời lượng:</span>
              <span className='summary-value'>{selectedOption?.label || ''}</span>
            </div>
            <div className='summary-row'>
              <span className='summary-label'>Giao thức:</span>
              <span className='summary-value'>{selectedProtocol?.toUpperCase()}</span>
            </div>
            <div className='summary-row'>
              <span className='summary-label'>Giá:</span>
              <span className='summary-value'>{unitPrice.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className='summary-row'>
              <span className='summary-label'>Số lượng:</span>
              <span className='summary-value'>{quantity}</span>
            </div>
          </div>

          {/* Balance warning */}
          {!isBalanceSufficient && (
            <div className='checkout-warning'>
              <AlertTriangle size={16} />
              <span>
                Số dư không đủ. Cần thêm{' '}
                <strong>{(total - sodu).toLocaleString('vi-VN')}đ</strong> để thanh toán.
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='checkout-footer'>
          <div className='checkout-total'>
            <span className='total-text'>Tổng Cộng:</span>
            <span className='total-amount'>{total.toLocaleString('vi-VN')}đ</span>
          </div>
          <button
            type='button'
            className='checkout-pay-btn'
            onClick={purchaseSuccess ? onClose : handlePurchase}
            disabled={isPending || (!isBalanceSufficient && !purchaseSuccess)}
            style={purchaseSuccess ? { background: '#16a34a' } : undefined}
          >
            {isPending ? (
              <>
                <Loader size={18} className='animate-pulse' /> Đang xử lý...
              </>
            ) : purchaseSuccess ? (
              <>
                <CheckCircle size={18} /> Mua thành công
              </>
            ) : (
              <>
                <ShoppingCart size={18} /> Thanh Toán
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutModal
