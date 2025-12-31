import { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application Error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
          style={{
            background: 'linear-gradient(180deg, hsl(222 47% 6%) 0%, hsl(222 47% 11%) 100%)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md"
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, hsl(45 90% 55% / 0.2), hsl(340 70% 55% / 0.2))',
                border: '1px solid hsl(45 90% 55% / 0.3)',
              }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertTriangle className="w-10 h-10 text-amber-400" />
            </motion.div>

            <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
              Oops! Something went wrong
            </h1>

            <p className="text-gray-400 mb-8 font-body">
              Don't worry, your magical journey can continue. Just refresh and we'll get you back on track.
            </p>

            <motion.button
              onClick={this.handleReload}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-medium text-white"
              style={{
                background: 'linear-gradient(135deg, hsl(217 70% 65%), hsl(200 50% 55%))',
                boxShadow: '0 0 40px hsl(217 70% 65% / 0.3)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-5 h-5" />
              Refresh & Continue
            </motion.button>

            <p className="mt-8 text-xs text-gray-500">
              ✨ New Year 2026 Magic Awaits ✨
            </p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;