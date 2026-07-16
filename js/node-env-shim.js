// Sets NODE_ENV=production for Framer runtime bundles
typeof document < "u" && (window.process = { ...window.process,
            env: { ...window.process?.env,
                NODE_ENV : "production"
            }
        });
