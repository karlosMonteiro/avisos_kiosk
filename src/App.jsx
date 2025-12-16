import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])

  const loadMessages = () => {
    const foundMessages = []

    // Buscar todas as chaves do localStorage que começam com "message" seguido de número
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      
      // Verificar se a chave corresponde ao padrão messageN (onde N é um número)
      if (key && /^message\d+$/.test(key)) {
        const value = localStorage.getItem(key)
        if (value) {
          // Extrair o número da chave (message1 -> 1, message2 -> 2, etc)
          const number = key.match(/\d+/)[0]
          foundMessages.push({
            key: key,
            number: parseInt(number),
            content: value
          })
        }
      }
    }

    // Ordenar mensagens pelo número
    foundMessages.sort((a, b) => a.number - b.number)
    
    // Só atualizar se realmente houver mudanças
    setMessages(prevMessages => {
      if (JSON.stringify(prevMessages) === JSON.stringify(foundMessages)) {
        return prevMessages
      }
      return foundMessages
    })
  }

  useEffect(() => {
    // Carregar mensagens ao iniciar
    loadMessages()

    // Atualizar quando localStorage mudar (em outra aba/janela)
    const handleStorageChange = () => {
      loadMessages()
    }
    window.addEventListener('storage', handleStorageChange)

    // Polling para detectar mudanças no mesmo contexto (console, etc)
    const interval = setInterval(loadMessages, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="container">
      <div className="header">
        <div className="icon">⚠️</div>
        <h1>AVISO</h1>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <div className="no-messages-icon">📭</div>
            <div className="no-messages-text">Nenhum aviso no momento</div>
            <div className="no-messages-hint">
              Para adicionar avisos, defina itens no localStorage com chaves como:<br />
              message1, message2, message3, etc.
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.key} 
              className="message-card"
            >
              <div className="message-number">Mensagem #{msg.number}</div>
              <div className="message-content">{msg.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
