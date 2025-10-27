'use client';

interface AleoLogoProps {
  colorScheme?: 'cyan' | 'green';
  size?: 'small' | 'medium';
  className?: string;
}

export function AleoLogo({ colorScheme = 'green', size = 'small', className = '' }: AleoLogoProps) {
  const colorClass = colorScheme === 'cyan' ? 'text-cyan-400' : 'text-green-400';
  const sizeClass = size === 'small' 
    ? 'text-[0.35rem] leading-[0.4rem] sm:text-[0.45rem] sm:leading-[0.5rem] md:text-[0.5rem] md:leading-[0.6rem]' 
    : 'text-[0.45rem] leading-[0.5rem] sm:text-[0.55rem] sm:leading-[0.6rem] md:text-xs md:leading-tight';
  
  return (
    <div className={`font-mono ${colorClass} ${className}`}>
      <pre className={`${sizeClass} font-bold whitespace-pre`}>
{`                                                                                             
 @@@@@@   @@@       @@@@@@@@   @@@@@@       @@@@@@    @@@  @@@  @@@@@@@@   @@@@@@   @@@@@@@  
@@@@@@@@  @@@       @@@@@@@@  @@@@@@@@     @@@@@@@@   @@@  @@@  @@@@@@@@  @@@@@@@   @@@@@@@  
@@!  @@@  @@!       @@!       @@!  @@@     @@!  @@@   @@!  @@@  @@!       !@@         @@!    
!@!  @!@  !@!       !@!       !@!  @!@     !@!  @!@   !@!  @!@  !@!       !@!         !@!    
@!@!@!@!  @!!       @!!!:!    @!@  !@!     @!@  !@!   @!@  !@!  @!!!:!    !!@@!!      @!!    
!!!@!!!!  !!!       !!!!!:    !@!  !!!     !@!  !!!   !@!  !!!  !!!!!:     !!@!!!     !!!    
!!:  !!!  !!:       !!:       !!:  !!!     !!:!!:!:   !!:  !!!  !!:            !:!    !!:    
:!:  !:!   :!:      :!:       :!:  !:!     :!: :!:    :!:  !:!  :!:           !:!     :!:    
::   :::   :: ::::   :: ::::  ::::: ::     ::::: :!   ::::: ::   :: ::::  :::: ::      ::    
 :   : :  : :: : :  : :: ::    : :  :       : :  :::   : :  :   : :: ::   :: : :       :     `}
      </pre>
    </div>
  );
}
