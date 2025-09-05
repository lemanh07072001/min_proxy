import React from 'react'

import './styles.css'
import { log } from 'console'

interface Protocol {
  id: string
  name: string
  description?: string
}

interface ProtocolSelectorProps {
  protocols: Protocol[]
  selectedProtocol?: string
  onProtocolChange: (protocolId: string) => void
  label?: string
  required?: boolean
  error?: string
  className?: string
}

const ProtocolSelector: React.FC<ProtocolSelectorProps> = ({
  protocols,
  selectedProtocol,
  onProtocolChange,
  label = 'Protocol',
  required = false,
  error,
  className = ''
}) => {
  return (
    <div className={`protocol-selector ${className}`}>
      {label && (
        <label className='protocol-label'>
          {label}
          {required && <span className='required'>*</span>}
        </label>
      )}
      <div className='protocol-options'>
        {protocols.map(protocol => (
          <div
            key={protocol.id}
            className={`protocol-option ${selectedProtocol === protocol.id ? 'selected' : ''}`}
            onClick={() => onProtocolChange(protocol.id)}
          >
            <input
              type='radio'
              name='protocol'
              value={protocol.id}
              checked={selectedProtocol === protocol.id}
              onChange={() => onProtocolChange(protocol.id)}
              className='protocol-radio'
            />
            <div className='protocol-info'>
              <span className='protocol-name'>{protocol.name}</span>
              {protocol.description && <span className='protocol-description'>{protocol.description}</span>}
            </div>
          </div>
        ))}
      </div>
      {error && <span className='error-message'>{error}</span>}
    </div>
  )
}

export default ProtocolSelector
