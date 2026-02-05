'use client';

export function LoadingSpinner() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-zinc-950">
      {/* Pokeball */}
      <div className="pokeball-spinner">
        <div className="pokeball">
          <div className="pokeball-top"></div>
          <div className="pokeball-center">
            <div className="pokeball-button"></div>
          </div>
          <div className="pokeball-bottom"></div>
        </div>
      </div>
      <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400">
        Loading Pokemon...
      </p>

      <style jsx>{`
        .pokeball-spinner {
          animation: bounce 1s ease-in-out infinite;
        }

        .pokeball {
          width: 80px;
          height: 80px;
          position: relative;
          animation: spin 1.5s linear infinite;
        }

        .pokeball-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(to bottom, #ff1a1a 0%, #cc0000 100%);
          border-radius: 80px 80px 0 0;
          border: 4px solid #222;
          border-bottom: none;
        }

        .pokeball-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(to bottom, #f2f2f2 0%, #e6e6e6 100%);
          border-radius: 0 0 80px 80px;
          border: 4px solid #222;
          border-top: none;
        }

        .pokeball-center {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 8px;
          margin-top: -4px;
          background: #222;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .pokeball-button {
          width: 24px;
          height: 24px;
          background: #f2f2f2;
          border: 4px solid #222;
          border-radius: 50%;
          box-shadow: 0 0 0 4px #f2f2f2;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}
