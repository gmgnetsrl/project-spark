import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { useCallback } from 'react';

export function Header() {
  const chat = useStore(chatStore);

  const handleSidebarToggle = useCallback(() => {
    // Dispatch a custom event that the Menu component can listen to
    const event = new CustomEvent('toggleSidebar');
    window.dispatchEvent(event);
  }, []);

  return (
    <header
      className={classNames('flex items-center px-4 border-b h-[var(--header-height)]', {
        'border-transparent': !chat.started,
        'border-bolt-elements-borderColor': chat.started,
      })}
    >
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary">
        <button
          type="button"
          onClick={handleSidebarToggle}
          className="p-1.5 rounded-lg hover:bg-bolt-elements-background-depth-3 transition-colors cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <div className="i-ph:sidebar-simple-duotone text-xl" />
        </button>
        <a href="/" className="flex items-center gap-3">
          <img
            src="/gmg-logo.png"
            alt="GMG Logo"
            className="h-14 w-auto rounded-lg object-contain backdrop-blur-sm p-2 hover:shadow-md transition-all duration-200"
          />
        </a>
      </div>
      {chat.started && ( // Display ChatDescription and HeaderActionButtons only when the chat has started.
        <>
          <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
            <ClientOnly>{() => <ChatDescription />}</ClientOnly>
          </span>
          <ClientOnly>
            {() => (
              <div className="">
                <HeaderActionButtons chatStarted={chat.started} />
              </div>
            )}
          </ClientOnly>
        </>
      )}
    </header>
  );
}
