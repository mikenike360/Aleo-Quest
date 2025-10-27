'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSoundManager } from '@/lib/audio';
import { 
  FlowEffect, 
  PRIVACY_LEVELS,
  TerminalPanel,
  TerminalButton,
  TerminalText,
  TerminalStatus,
  ASCII_ART
} from '@/components/zkVisuals';

interface CoinPaymentConfig {
  totalGold: number;
  requiredAmount: number;
}

interface CoinPaymentProps {
  config: CoinPaymentConfig;
  onPaymentComplete: (paymentAmount: number) => void;
}

interface Coin {
  id: string;
  value: number;
  originalIndex: number;
}

function ClickableCoin({ coin, onCoinClick }: { coin: Coin; onCoinClick: (coinId: string) => void }) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    onCoinClick(coin.id);
    
    // Reset click state after animation
    setTimeout(() => setIsClicked(false), 300);
  };

  return (
    <motion.div
      className="w-10 h-10 sm:w-8 sm:h-8 cursor-pointer border border-yellow-500 bg-black flex items-center justify-center relative flex-shrink-0"
      onClick={handleClick}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.8 }}
      animate={isClicked ? { 
        scale: [1, 1.3, 1],
        rotate: [0, 180, 360]
      } : {}}
      transition={{ duration: 0.4 }}
    >
      {/* ASCII coin symbol - terminal style */}
      <TerminalText colorScheme="yellow" variant="primary" className="text-xs font-mono">
        ╔═╗
      </TerminalText>
      
      {/* Coin value - smaller */}
      <TerminalText colorScheme="yellow" variant="accent" className="absolute -bottom-1 -right-1 text-xs font-mono bg-yellow-500 text-black px-0.5">
        {coin.value}
      </TerminalText>
      
      {/* Click indicator */}
      {isClicked && (
        <motion.div
          className="absolute inset-0 bg-green-400/30 border border-green-400"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 1] }}
          transition={{ duration: 0.4 }}
        />
      )}
    </motion.div>
  );
}

function MagneticPaymentArea({ children, paymentTotal, requiredAmount }: { 
  children: React.ReactNode; 
  paymentTotal: number; 
  requiredAmount: number; 
}) {

  return (
    <div className="relative flex-1">
      <div
        className={`
          border transition-all relative overflow-hidden
          ${paymentTotal >= requiredAmount 
            ? 'border-green-500 bg-green-500/10' 
            : 'border-dashed border-gray-600 bg-gray-800/30'
          }
        `}
      >
        {/* Magnetic field effect */}
        <div className={`
          absolute inset-0 transition-all duration-500
          ${paymentTotal >= requiredAmount 
            ? 'bg-gradient-radial from-green-500/20 via-green-500/10 to-transparent' 
            : 'bg-gradient-radial from-blue-500/10 via-blue-500/5 to-transparent'
          }
        `} />
        
        {children}
        
        {/* Payment success indicator */}
        {paymentTotal >= requiredAmount && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <TerminalText colorScheme="yellow" variant="success" className="text-lg">
                ✓
              </TerminalText>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}


export function CoinPayment({ config, onPaymentComplete }: CoinPaymentProps) {
  const [walletCoins, setWalletCoins] = useState<Coin[]>(() => {
    const coins: Coin[] = [];
    const coinValue = 50; // Each coin is worth 50 gold
    const numCoins = config.totalGold / coinValue;
    
    for (let i = 0; i < numCoins; i++) {
      coins.push({
        id: `wallet-${i}`,
        value: coinValue,
        originalIndex: i
      });
    }
    return coins;
  });
  const soundManager = useSoundManager();
  
  const [paymentCoins, setPaymentCoins] = useState<Coin[]>([]);
  const [isWrapped, setIsWrapped] = useState(false);
  const [isPaymentSent, setIsPaymentSent] = useState(false);
  const paymentTotal = paymentCoins.reduce((sum, coin) => sum + coin.value, 0);
  const canProceed = paymentTotal >= config.requiredAmount && isWrapped;
  const remainingBalance = config.totalGold - paymentTotal;

  const handleCoinClick = (coinId: string) => {
    // Check if coin is in wallet or payment area
    const walletCoin = walletCoins.find(c => c.id === coinId);
    const paymentCoin = paymentCoins.find(c => c.id === coinId);
    
    if (walletCoin) {
      // Play coin sound
      soundManager.playClickSound();
      // Move coin from wallet to payment area
      setWalletCoins(walletCoins.filter(c => c.id !== coinId));
      setPaymentCoins([...paymentCoins, walletCoin]);
    } else if (paymentCoin) {
      // Play different sound for return
      soundManager.playDiscoverySound();
      // Move coin from payment area back to wallet
      setPaymentCoins(paymentCoins.filter(c => c.id !== coinId));
      setWalletCoins([...walletCoins, paymentCoin].sort((a, b) => a.originalIndex - b.originalIndex));
    }
  };


  const handleWrapPayment = () => {
    setIsWrapped(true);
  };

  const handleSubmitPayment = () => {
    if (canProceed) {
      setIsPaymentSent(true);
      soundManager.playSuccessSound();
    }
  };

  const handleContinueToNextStage = () => {
    onPaymentComplete(paymentTotal);
  };

  return (
    <div className="space-y-6">
      {/* Main Payment Interface - Transforms */}
      <TerminalPanel colorScheme="yellow" title="PRIVATE_PAYMENT">
        <div className="space-y-3">
          {!isPaymentSent ? (
            <>
              {/* Instructions */}
              <div className="space-y-2">
                <TerminalText colorScheme="yellow" variant="accent" className="text-sm">
                  Click coins from wallet to payment area
                </TerminalText>
                <TerminalText colorScheme="yellow" variant="muted" className="text-xs">
                  REQUIRED: {config.requiredAmount}g | CURRENT: {paymentTotal}g
                </TerminalText>
              </div>

              {/* Payment Flow - Compact */}
              <div className="flex items-center justify-center space-x-4 py-2">
                <div className="text-center">
                  <div className="w-8 h-8 border border-yellow-500 bg-black rounded flex items-center justify-center mb-1">
                    <TerminalText colorScheme="yellow" variant="primary" className="text-sm">
                      {ASCII_ART.wallet}
                    </TerminalText>
                  </div>
                  <TerminalText colorScheme="yellow" variant="muted" className="text-xs">WALLET</TerminalText>
                </div>
                <TerminalText colorScheme="yellow" variant="accent" className="text-sm">
                  {ASCII_ART.arrow}
                </TerminalText>
                <div className="text-center">
                  <div className="w-8 h-8 border border-green-500 bg-black rounded flex items-center justify-center mb-1">
                    <TerminalText colorScheme="yellow" variant="success" className="text-sm">
                      {ASCII_ART.merchant}
                    </TerminalText>
                  </div>
                  <TerminalText colorScheme="yellow" variant="muted" className="text-xs">MERCHANT</TerminalText>
                </div>
              </div>

              {/* Compact Wallet and Payment Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <TerminalText colorScheme="yellow" variant="accent">
                    WALLET: {walletCoins.length * 50}g
                  </TerminalText>
                  <TerminalText colorScheme="yellow" variant="accent">
                    PAYMENT: {paymentTotal}/{config.requiredAmount}g
                  </TerminalText>
                </div>
                
                {/* Single compact row with wallet and payment areas */}
                <div className="flex items-center gap-2 p-1 border border-yellow-500 bg-black">
                  {/* Wallet coins */}
                  <div className="flex flex-wrap gap-1">
                    {walletCoins.map((coin) => (
                      <ClickableCoin key={coin.id} coin={coin} onCoinClick={handleCoinClick} />
                    ))}
                  </div>
                  
                  {/* Separator */}
                  <TerminalText colorScheme="yellow" variant="muted" className="text-xs px-2">
                    →
                  </TerminalText>
                  
                  {/* Payment area */}
                  <MagneticPaymentArea paymentTotal={paymentTotal} requiredAmount={config.requiredAmount}>
                    <div className="flex flex-wrap gap-1 min-h-[32px] items-center">
                      {paymentCoins.map((coin) => (
                        <ClickableCoin key={coin.id} coin={coin} onCoinClick={handleCoinClick} />
                      ))}
                      
                      {paymentCoins.length === 0 && (
                        <TerminalText colorScheme="yellow" variant="muted" className="text-xs">
                          Click coins →
                        </TerminalText>
                      )}
                    </div>
                  </MagneticPaymentArea>
                </div>
              </div>

              {/* Status - Compact */}
              <div className="flex items-center space-x-4 text-xs">
                <TerminalText colorScheme="yellow" variant="muted">
                  MERCHANT_SEES: {isWrapped ? '✓' : '???'}
                </TerminalText>
                <TerminalText colorScheme="yellow" variant="muted">
                  YOUR_BALANCE: {remainingBalance}g
                </TerminalText>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <TerminalButton
                  onClick={handleWrapPayment}
                  disabled={paymentTotal < config.requiredAmount || isWrapped}
                  colorScheme="yellow"
                  command={isWrapped ? "wrapped" : "privacy_wrapper"}
                  className="flex-1 py-3 text-base"
                >
                  {isWrapped ? 'WRAPPED' : 'PRIVACY WRAPPER'}
                </TerminalButton>
                
                <TerminalButton
                  onClick={handleSubmitPayment}
                  disabled={!canProceed}
                  colorScheme="yellow"
                  command="send_payment"
                  className="flex-1 py-3 text-base"
                >
                  SEND PAYMENT
                </TerminalButton>
              </div>
            </>
          ) : (
            /* Success State - Replace interactive content */
            <div className="text-center space-y-3">
              <TerminalStatus status="ok" className="text-base font-bold">
                Payment sent successfully!
              </TerminalStatus>
              <TerminalText colorScheme="yellow" variant="muted" className="text-sm">
                Amount: {paymentTotal}g | Privacy: Protected
              </TerminalText>
            </div>
          )}
        </div>
      </TerminalPanel>

      {/* Continue Button - Separate */}
      {isPaymentSent && (
        <TerminalButton
          onClick={handleContinueToNextStage}
          colorScheme="yellow"
          command="continue_quest"
          className="w-full py-3 text-base"
        >
          CONTINUE TO FINAL GATE →
        </TerminalButton>
      )}

      {/* Terminal Feedback */}
      {!isPaymentSent && paymentTotal > 0 && paymentTotal < config.requiredAmount && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TerminalStatus status="warning" className="text-sm">
            Need {config.requiredAmount - paymentTotal} more gold to complete payment
          </TerminalStatus>
        </motion.div>
      )}
    </div>
  );
}
