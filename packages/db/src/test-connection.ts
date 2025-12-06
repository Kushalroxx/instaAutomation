import { db } from './index'
import { redis, getQueueStats } from './redis'

/**
 * Test database connection
 */
export async function testDatabaseConnection() {
    try {
        console.log('🔍 Testing PostgreSQL connection...')
        await db.$connect()
        console.log('✅ PostgreSQL connected successfully')

        // Try a simple query
        const userCount = await db.user.count()
        console.log(`📊 Database has ${userCount} users`)

        return true
    } catch (error) {
        console.error('❌ PostgreSQL connection failed:', error)
        return false
    }
}

/**
 * Test Redis connection
 */
export async function testRedisConnection() {
    try {
        console.log('🔍 Testing Redis connection...')
        await redis.ping()
        console.log('✅ Redis connected successfully')

        // Test set/get
        await redis.set('test:connection', 'success', 'EX', 10)
        const value = await redis.get('test:connection')
        console.log(`📊 Redis test value: ${value}`)

        return true
    } catch (error) {
        console.error('❌ Redis connection failed:', error)
        return false
    }
}

/**
 * Test all connections
 */
export async function testAllConnections() {
    console.log('\n🚀 Testing all database connections...\n')

    const dbOk = await testDatabaseConnection()
    console.log('')
    const redisOk = await testRedisConnection()
    console.log('')

    if (dbOk && redisOk) {
        console.log('✅ All connections successful!\n')

        // Show queue stats
        console.log('📊 Queue Statistics:')
        const webhookStats = await getQueueStats('webhook')
        const messageStats = await getQueueStats('message')
        const sendStats = await getQueueStats('send')

        console.log('  Webhook Queue:', webhookStats)
        console.log('  Message Queue:', messageStats)
        console.log('  Send Queue:', sendStats)

        return true
    } else {
        console.log('❌ Some connections failed\n')
        return false
    }
}

// Run test if this file is executed directly
if (require.main === module) {
    testAllConnections()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error('Fatal error:', error)
            process.exit(1)
        })
}
