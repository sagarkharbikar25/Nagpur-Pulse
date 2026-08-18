import { useState, useRef, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useDashboard } from '../../hooks/useDashboard';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  action?: { label: string; link: string };
}

export default function CitizenCivicAIPage() {
  const { data: dashboard } = useDashboard();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Namaste! I am the Nagpur Pulse AI Assistant powered by NVIDIA Nemotron. You can ask me about civic issues, active ward hotspots, resolution timelines, or get help filing a complaint.',
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const handleSend = (textToSend?: string) => {
    const userQuery = textToSend || input;
    if (!userQuery.trim()) return;

    const newMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userQuery,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInput('');
    setTyping(true);

    setTimeout(() => {
      let aiReply = '';
      const queryLower = userQuery.toLowerCase();

      if (queryLower.includes('pothole') || queryLower.includes('road')) {
        aiReply = `Currently, Dharampeth and Manewada have the highest reported pothole frequency. A cluster of 8 reports triggered an active Hotspot alert on West High Court Road. NMC repair crews have scheduled asphalt filling.`;
      } else if (queryLower.includes('water') || queryLower.includes('leak')) {
        aiReply = `Water supply complaints are prioritized under the Nagpur Municipal Corporation 48-hour SLA. To report a leak or low pressure, click below to open the AI report form.`;
      } else if (queryLower.includes('hotspot')) {
        aiReply = `Nagpur currently has ${dashboard?.active_hotspots ?? 2} active hotspot zones requiring accelerated intervention. Citywide resolution rate is currently at ${dashboard?.city_resolution_rate ?? 78}%.`;
      } else if (queryLower.includes('officer') || queryLower.includes('ward')) {
        aiReply = `Dharampeth Ward (W-12) is supervised by Ward Officer Sharma. The resolution score is 87/100 with 18 resolved issues this week.`;
      } else {
        aiReply = `I received your query regarding "${userQuery}". Nagpur Pulse AI is analyzing municipal sensor data and live reports. If this is an urgent breakdown, please submit a verified issue report with a photo.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setTyping(false);
    }, 1200);
  };

  return (
    <AppLayout
      title="Civic AI Intelligence Assistant"
      subtitle="Ask questions, query live municipal data, or get guidance on civic resolutions."
      role="citizen"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Chat Window */}
        <div className="lg:col-span-8 bg-[#191b22] border border-[#33343b] rounded-xl flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="px-5 py-3 border-b border-[#282a30] bg-[#111319] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#fa5c1b]/20 border border-[#fa5c1b] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#fa5c1b] text-xs">psychology</span>
              </div>
              <div>
                <span className="text-xs font-bold text-white block">NVIDIA Nemotron 3 AI</span>
                <span className="text-[10px] text-green-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Live City Context Synced
                </span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-xl ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                    m.sender === 'ai'
                      ? 'bg-[#fa5c1b]/20 border-[#fa5c1b] text-[#fa5c1b]'
                      : 'bg-[#282a30] border-gray-600 text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {m.sender === 'ai' ? 'psychology' : 'person'}
                  </span>
                </div>
                <div>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
                      m.sender === 'ai'
                        ? 'bg-[#111319] border-[#282a30] text-[#e2e2eb] rounded-tl-none'
                        : 'bg-[#fa5c1b] border-orange-600 text-white rounded-tr-none font-medium'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span
                    className={`text-[10px] font-mono text-[#8B8FA8] mt-1 block ${
                      m.sender === 'user' ? 'text-right' : ''
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-3 max-w-xl">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-[#fa5c1b]/20 border-[#fa5c1b] text-[#fa5c1b]">
                  <span className="material-symbols-outlined text-sm">psychology</span>
                </div>
                <div className="p-3.5 rounded-2xl text-xs bg-[#111319] border border-[#282a30] text-[#8B8FA8] rounded-tl-none flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#fa5c1b] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#fa5c1b] animate-bounce delay-100" />
                  <span className="w-2 h-2 rounded-full bg-[#fa5c1b] animate-bounce delay-200" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-[#282a30] bg-[#111319]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about potholes, water leaks, ward status, or municipal alerts..."
                className="flex-1 bg-[#191b22] border border-[#33343b] rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#fa5c1b]"
              />
              <button
                type="submit"
                className="bg-[#fa5c1b] hover:bg-[#d94a10] text-white px-4 py-2.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>Send</span>
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          </div>
        </div>

        {/* Quick Prompts & Knowledge Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-xs font-mono text-[#fa5c1b] uppercase">Quick Inquiries</h3>
            <div className="space-y-2">
              {[
                'Where are the active pothole clusters in Nagpur?',
                'How do I report an open drainage hazard?',
                'Show me the Dharampeth ward resolution score',
                'What is the average response SLA for streetlights?',
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left p-2.5 rounded-lg bg-[#111319] hover:bg-[#282a30] border border-[#282a30] text-xs text-[#e2e2eb] transition-colors"
                >
                  💬 {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#191b22] border border-[#33343b] rounded-xl p-5 space-y-2">
            <h4 className="text-xs font-mono text-[#8B8FA8] uppercase">AI Model Architecture</h4>
            <p className="text-[11px] text-[#8B8FA8] leading-relaxed">
              Nagpur Pulse leverages <strong>NVIDIA Nemotron-3 Super 120B</strong> for automated severity detection, category classification, and civic policy guidance.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
