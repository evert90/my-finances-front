const withPWA = require('next-pwa');
//const runtimeCaching = require('next-pwa/cache')

const pwa = () => withPWA({
    publicRuntimeConfig: {
        baseUrl: process.env.NODE_ENV === 'development'
            ? 'http://localhost:21200' // development api
            : 'http://localhost:21200', // production api

    },
    excludeDefaultMomentLocales: false,
    pwa: {
        //disable: process.env.NODE_ENV === 'development',
        dest: 'public',
        mode: 'production',
        runtimeCaching: [
            {
                urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'google-fonts-webfonts',
                    expiration: {
                        maxEntries: 16,
                        maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
                    },
                },
            },
            {
                urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
                handler: 'StaleWhileRevalidate',
                options: {
                    cacheName: 'google-fonts-stylesheets',
                    expiration: {
                        maxEntries: 16,
                        maxAgeSeconds: 30 * 24 * 60 * 60, // 7 days
                    },
                },
            },
            {
                urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
                handler: 'StaleWhileRevalidate',
                options: {
                    cacheName: 'static-font-assets',
                    expiration: {
                        maxEntries: 16,
                        maxAgeSeconds: 30 * 24 * 60 * 60 // 7 days
                    }
                }
            },
            {
                urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'static-image-assets',
                    expiration: {
                        maxEntries: 64,
                        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                    }
                }
            },
            {
                urlPattern: /\/_next\/image\?url=.+$/i,
                handler: "NetworkFirst",
                options: {
                    cacheName: "next-image",
                    expiration: {
                        maxEntries: 64,
                        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                    },
                },
            },
            {
                urlPattern: /\.(?:mp3|wav|ogg)$/i,
                handler: 'NetworkFirst',
                options: {
                    rangeRequests: true,
                    cacheName: 'static-audio-assets',
                    expiration: {
                        maxEntries: 128,
                        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                    }
                }
            },
            {
                urlPattern: /\.(?:mp4)$/i,
                handler: 'NetworkFirst',
                options: {
                    rangeRequests: true,
                    cacheName: 'static-video-assets',
                    expiration: {
                        maxEntries: 128,
                        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                    }
                }
            },
            {
                urlPattern: /\.(?:js)$/i,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'static-js-assets',
                    expiration: {
                        maxEntries: 128,
                        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                    }
                }
            },
            {
                urlPattern: /\.(?:css|less)$/i,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'static-style-assets',
                    expiration: {
                        maxEntries: 128,
                        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                    }
                }
            },
            {
                urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
                handler: "NetworkFirst",
                options: {
                    cacheName: "next-data",
                    expiration: {
                        maxEntries: 128,
                        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                    }
                },
            },
            {
                urlPattern: /\.(?:json|xml|csv)$/i,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'static-data-assets',
                    expiration: {
                        maxEntries: 128,
                        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                    }
                }
            },
            {
                urlPattern: ({ url }) => {
                    const isSameOrigin = self.origin === url.origin
                    if (!isSameOrigin) return false
                    const pathname = url.pathname
                    // Exclude /api/auth/callback/* to fix OAuth workflow in Safari without impact other environment
                    // Above route is default for next-auth, you may need to change it if your OAuth workflow has a different callback route
                    // Issue: https://github.com/shadowwalker/next-pwa/issues/131#issuecomment-821894809
                    if (pathname.startsWith('/api/auth/')) return false
                    if (pathname.startsWith('/api/')) return true
                    return false
                },
                handler: 'NetworkFirst',
                method: 'GET',
                options: {
                    cacheName: 'apis',
                    expiration: {
                        maxEntries: 64,
                        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                    },
                    networkTimeoutSeconds: 35 // fall back to cache if api does not response within 10 seconds
                }
            },
            {
                urlPattern: ({ url }) => {
                    const isSameOrigin = self.origin === url.origin
                    if (!isSameOrigin) return false
                    const pathname = url.pathname
                    if (pathname.startsWith('/api/')) return false
                    return true
                },
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'others',
                    expiration: {
                        maxEntries: 128,
                        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                    },
                    networkTimeoutSeconds: 35
                }
            },
            {
                urlPattern: ({ url }) => {
                    const isSameOrigin = self.origin === url.origin
                    return !isSameOrigin
                },
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'cross-origin',
                    expiration: {
                        maxEntries: 128,
                        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                    },
                    networkTimeoutSeconds: 35
                }
            }
        ]
    }
})



// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
    pwa,
    {
        // For all available options, see:
        // https://www.npmjs.com/package/@sentry/webpack-plugin#options

        // Only print logs for uploading source maps in CI
        silent: !process.env.CI,

        // For all available options, see:
        // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

        // Upload a larger set of source maps for prettier stack traces (increases build time)
        widenClientFileUpload: true,

        // Automatically annotate React components to show their full name in breadcrumbs and session replay
        reactComponentAnnotation: {
            enabled: true,
        },

        // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
        // This can increase your server load as well as your hosting bill.
        // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
        // side errors will fail.
        tunnelRoute: "/monitoring",

        // Automatically tree-shake Sentry logger statements to reduce bundle size
        disableLogger: true,

        // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
        // See the following for more information:
        // https://docs.sentry.io/product/crons/
        // https://vercel.com/docs/cron-jobs
        automaticVercelMonitors: true,

        sourcemaps: {
            deleteSourcemapsAfterUpload: true
        }
    }
);
