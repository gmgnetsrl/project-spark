import React, { useState } from 'react';
import { Switch } from '~/components/ui/Switch';
import { Card, CardContent } from '~/components/ui/Card';
import { Link, Server, Monitor, Globe, Key, Eye, EyeOff } from 'lucide-react';
import { classNames } from '~/utils/classNames';
import type { IProviderConfig } from '~/types/model';
import { PROVIDER_DESCRIPTIONS } from './types';

// Provider Card Component
interface ProviderCardProps {
  provider: IProviderConfig;
  onToggle: (enabled: boolean) => void;
  onUpdateBaseUrl: (url: string) => void;
  onUpdateApiKey: (apiKey: string) => void;
}

function ProviderCard({ provider, onToggle, onUpdateBaseUrl, onUpdateApiKey }: ProviderCardProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [editingField, setEditingField] = useState<'baseUrl' | 'apiKey' | null>(null);
  const [tempBaseUrl, setTempBaseUrl] = useState<string>('');
  const [tempApiKey, setTempApiKey] = useState<string>('');

  const getIcon = (providerName: string) => {
    switch (providerName) {
      case 'Ollama':
        return Server;
      case 'LMStudio':
        return Monitor;
      case 'OpenAILike':
        return Globe;
      default:
        return Server;
    }
  };

  const Icon = getIcon(provider.name);

  const handleStartEditingBaseUrl = () => {
    setTempBaseUrl(provider.settings.baseUrl || '');
    setEditingField('baseUrl');
  };

  const handleSaveBaseUrl = () => {
    onUpdateBaseUrl(tempBaseUrl);
    setEditingField(null);
  };

  const handleCancelBaseUrl = () => {
    setEditingField(null);
  };

  const handleStartEditingApiKey = () => {
    setTempApiKey(provider.settings.apiKey || '');
    setEditingField('apiKey');
  };

  const handleSaveApiKey = () => {
    onUpdateApiKey(tempApiKey);
    setEditingField(null);
  };

  const handleCancelApiKey = () => {
    setEditingField(null);
  };

  return (
    <Card className="bg-bolt-elements-background-depth-2 hover:bg-bolt-elements-background-depth-3 transition-all duration-300 shadow-sm hover:shadow-md border border-bolt-elements-borderColor hover:border-purple-500/30">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div
              className={classNames(
                'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
                provider.settings.enabled
                  ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 ring-1 ring-purple-500/30'
                  : 'bg-bolt-elements-background-depth-3',
              )}
            >
              <Icon
                className={classNames(
                  'w-6 h-6 transition-all duration-300',
                  provider.settings.enabled ? 'text-purple-500' : 'text-bolt-elements-textTertiary',
                )}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">{provider.name}</h3>
                <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500 font-medium">Local</span>
              </div>
              <p className="text-sm text-bolt-elements-textSecondary mb-4">
                {PROVIDER_DESCRIPTIONS[provider.name as keyof typeof PROVIDER_DESCRIPTIONS]}
              </p>

              {provider.settings.enabled && (
                <div className="space-y-3">
                  {/* Base URL Field */}
                  <div>
                    <label className="text-sm font-medium text-bolt-elements-textPrimary">API Endpoint</label>
                    {editingField === 'baseUrl' ? (
                      <div className="relative">
                        <input
                          type="text"
                          value={tempBaseUrl}
                          onChange={(e) => setTempBaseUrl(e.target.value)}
                          placeholder={`Enter ${provider.name} base URL`}
                          className="w-full px-4 py-3 rounded-lg text-sm bg-bolt-elements-background-depth-4 border border-purple-500/30 text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 shadow-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveBaseUrl();
                            } else if (e.key === 'Escape') {
                              handleCancelBaseUrl();
                            }
                          }}
                          onBlur={handleSaveBaseUrl}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <button
                        onClick={handleStartEditingBaseUrl}
                        className="w-full px-4 py-3 rounded-lg text-sm bg-bolt-elements-background-depth-3 border border-bolt-elements-borderColor hover:border-purple-500/30 hover:bg-bolt-elements-background-depth-4 hover:shadow-sm transition-all duration-200 text-left group"
                      >
                        <div className="flex items-center gap-3 text-bolt-elements-textSecondary group-hover:text-bolt-elements-textPrimary">
                          <Link className="w-4 h-4 group-hover:text-purple-500 transition-colors" />
                          <span className="font-mono">{provider.settings.baseUrl || 'Click to set base URL'}</span>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* API Key Field - Only for OpenAILike */}
                  {provider.name === 'OpenAILike' && (
                    <div>
                      <label className="text-sm font-medium text-bolt-elements-textPrimary flex items-center gap-2">
                        <Key className="w-3.5 h-3.5" />
                        API Key
                      </label>
                      {editingField === 'apiKey' ? (
                        <div className="relative">
                          <input
                            type={showApiKey ? 'text' : 'password'}
                            value={tempApiKey}
                            onChange={(e) => setTempApiKey(e.target.value)}
                            placeholder={`Enter ${provider.name} API key`}
                            className="w-full px-4 py-3 pr-10 rounded-lg text-sm bg-bolt-elements-background-depth-4 border border-purple-500/30 text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 shadow-sm"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveApiKey();
                              } else if (e.key === 'Escape') {
                                handleCancelApiKey();
                              }
                            }}
                            onBlur={handleSaveApiKey}
                            autoFocus
                          />
                          <button
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary transition-colors"
                            type="button"
                          >
                            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={handleStartEditingApiKey}
                          className="w-full px-4 py-3 rounded-lg text-sm bg-bolt-elements-background-depth-3 border border-bolt-elements-borderColor hover:border-purple-500/30 hover:bg-bolt-elements-background-depth-4 hover:shadow-sm transition-all duration-200 text-left group"
                        >
                          <div className="flex items-center gap-3 text-bolt-elements-textSecondary group-hover:text-bolt-elements-textPrimary">
                            <Key className="w-4 h-4 group-hover:text-purple-500 transition-colors" />
                            <span className="font-mono">
                              {provider.settings.apiKey
                                ? `${provider.settings.apiKey.slice(0, 4)}••••••••••••••••`
                                : 'Click to set API key'}
                            </span>
                          </div>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <Switch
            checked={provider.settings.enabled}
            onCheckedChange={onToggle}
            aria-label={`Toggle ${provider.name} provider`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default ProviderCard;
