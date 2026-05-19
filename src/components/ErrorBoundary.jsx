import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[200px] flex items-center justify-center bg-cyber-dark">
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <span className="text-red-400 text-2xl font-bold">!</span>
            </div>
            <h3 className="text-lg font-heading font-bold text-white mb-2">
              {this.props.fallbackTitle || 'Có lỗi xảy ra'}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {this.props.fallbackMessage || 'Vui lòng thử lại sau.'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 text-sm font-medium bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue rounded-lg hover:bg-cyber-blue/20 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
