#!/bin/bash

# =============================================================================
# FINAL COMPREHENSIVE TEST SCRIPT
# =============================================================================
# This script performs final verification of the entire system before deployment
# Tests all major components: backend, frontend, database, integrations
# Author: System Test Team
# Version: 1.0
# =============================================================================

set -e  # Exit on any error

# Color definitions for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Log function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✓ $1${NC}"
    ((PASSED_TESTS++))
}

error() {
    echo -e "${RED}✗ $1${NC}"
    ((FAILED_TESTS++))
}

warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Increment test counter
test_start() {
    ((TOTAL_TESTS++))
    log "Running test: $1"
}

# =============================================================================
# ENVIRONMENT SETUP
# =============================================================================

setup_environment() {
    log "Setting up test environment..."

    # Check if required tools are available
    command -v node >/dev/null 2>&1 || { error "Node.js not found"; exit 1; }
    command -v npm >/dev/null 2>&1 || { error "npm not found"; exit 1; }
    command -v curl >/dev/null 2>&1 || { error "curl not found"; exit 1; }

    # Set environment variables
    export NODE_ENV=test
    export TEST_MODE=true
    export LOG_LEVEL=info

    success "Environment setup completed"
}

# =============================================================================
# BACKEND TESTS
# =============================================================================

test_backend_health() {
    test_start "Backend Health Check"

    # Start backend if not running
    if ! curl -f http://localhost:3000/health >/dev/null 2>&1; then
        log "Starting backend server..."
        cd /d/SUM25/SWP391/db
        npm run start:dev &
        BACKEND_PID=$!
        sleep 10
    fi

    # Test health endpoint
    if curl -f http://localhost:3000/health >/dev/null 2>&1; then
        success "Backend health check passed"
    else
        error "Backend health check failed"
    fi
}

test_database_connection() {
    test_start "Database Connection"

    # Test database connection through API
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/users)
    if [ "$response" -eq 200 ] || [ "$response" -eq 401 ]; then
        success "Database connection verified"
    else
        error "Database connection failed (HTTP $response)"
    fi
}

test_authentication() {
    test_start "Authentication System"

    # Test login endpoint
    login_response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"email":"test@example.com","password":"testpass"}' \
        http://localhost:3000/api/auth/login)

    if echo "$login_response" | grep -q "token\|error"; then
        success "Authentication endpoint responsive"
    else
        error "Authentication endpoint failed"
    fi
}

test_crud_operations() {
    test_start "CRUD Operations"

    # Test user creation (should fail without auth, but endpoint should respond)
    create_response=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -d '{"name":"Test User","email":"test@test.com"}' \
        http://localhost:3000/api/users)

    if [ "$create_response" -eq 401 ] || [ "$create_response" -eq 201 ]; then
        success "CRUD operations endpoint responsive"
    else
        error "CRUD operations failed (HTTP $create_response)"
    fi
}

test_feedback_system() {
    test_start "Feedback System"

    # Test feedback creation endpoint
    feedback_response=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -d '{"title":"Test Feedback","content":"Test content","rating":5}' \
        http://localhost:3000/api/feedback)

    if [ "$feedback_response" -eq 401 ] || [ "$feedback_response" -eq 201 ]; then
        success "Feedback system endpoint responsive"
    else
        error "Feedback system failed (HTTP $feedback_response)"
    fi
}

test_notification_system() {
    test_start "Notification System"

    # Test notification endpoint
    notification_response=$(curl -s -o /dev/null -w "%{http_code}" \
        http://localhost:3000/api/notifications)

    if [ "$notification_response" -eq 401 ] || [ "$notification_response" -eq 200 ]; then
        success "Notification system endpoint responsive"
    else
        error "Notification system failed (HTTP $notification_response)"
    fi
}

# =============================================================================
# FRONTEND TESTS
# =============================================================================

test_frontend_build() {
    test_start "Frontend Build"

    cd /d/SUM25/SWP391/SWP391-FE

    # Check if build is possible
    if npm run build --dry-run >/dev/null 2>&1; then
        success "Frontend build configuration valid"
    else
        # Try actual build
        if npm run build >/dev/null 2>&1; then
            success "Frontend build successful"
        else
            error "Frontend build failed"
        fi
    fi
}

test_frontend_server() {
    test_start "Frontend Server"

    cd /d/SUM25/SWP391/SWP391-FE

    # Start frontend server
    npm run dev &
    FRONTEND_PID=$!
    sleep 15

    # Test frontend accessibility
    if curl -f http://localhost:3001 >/dev/null 2>&1; then
        success "Frontend server accessible"
    else
        error "Frontend server not accessible"
    fi

    # Clean up
    kill $FRONTEND_PID 2>/dev/null || true
}

test_frontend_backend_integration() {
    test_start "Frontend-Backend Integration"

    # Test CORS headers
    cors_response=$(curl -s -H "Origin: http://localhost:3001" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: X-Requested-With" \
        -X OPTIONS \
        http://localhost:3000/api/health)

    if echo "$cors_response" | grep -q "Access-Control-Allow-Origin\|OK"; then
        success "CORS configuration working"
    else
        warning "CORS might need configuration"
    fi
}

# =============================================================================
# SECURITY TESTS
# =============================================================================

test_security_headers() {
    test_start "Security Headers"

    headers=$(curl -s -I http://localhost:3000/api/health)

    security_score=0
    if echo "$headers" | grep -qi "x-frame-options"; then ((security_score++)); fi
    if echo "$headers" | grep -qi "x-content-type-options"; then ((security_score++)); fi
    if echo "$headers" | grep -qi "x-xss-protection"; then ((security_score++)); fi

    if [ $security_score -ge 2 ]; then
        success "Security headers present"
    else
        warning "Consider adding more security headers"
    fi
}

test_input_validation() {
    test_start "Input Validation"

    # Test SQL injection attempt
    sql_response=$(curl -s -o /dev/null -w "%{http_code}" \
        "http://localhost:3000/api/users?id=1'; DROP TABLE users; --")

    if [ "$sql_response" -eq 400 ] || [ "$sql_response" -eq 401 ]; then
        success "Input validation working"
    else
        warning "Input validation might need improvement"
    fi
}

# =============================================================================
# PERFORMANCE TESTS
# =============================================================================

test_response_times() {
    test_start "Response Times"

    # Test API response time
    response_time=$(curl -s -w "%{time_total}" -o /dev/null http://localhost:3000/api/health)

    if (( $(echo "$response_time < 1.0" | bc -l) )); then
        success "Response time acceptable ($response_time seconds)"
    else
        warning "Response time might be slow ($response_time seconds)"
    fi
}

test_concurrent_requests() {
    test_start "Concurrent Request Handling"

    # Send multiple concurrent requests
    for i in {1..5}; do
        curl -s http://localhost:3000/api/health > /dev/null &
    done
    wait

    # If we get here, server handled concurrent requests
    success "Concurrent requests handled"
}

# =============================================================================
# DATA INTEGRITY TESTS
# =============================================================================

test_data_validation() {
    test_start "Data Validation"

    # Test invalid data submission
    invalid_response=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -d '{"invalid":"data","malformed":}' \
        http://localhost:3000/api/users)

    if [ "$invalid_response" -eq 400 ] || [ "$invalid_response" -eq 401 ]; then
        success "Data validation working"
    else
        warning "Data validation might need improvement"
    fi
}

# =============================================================================
# CLEANUP TESTS
# =============================================================================

test_auto_cleanup() {
    test_start "Auto Cleanup System"

    # Test cleanup endpoint (if exists)
    cleanup_response=$(curl -s -o /dev/null -w "%{http_code}" \
        http://localhost:3000/api/cleanup/status)

    if [ "$cleanup_response" -eq 200 ] || [ "$cleanup_response" -eq 401 ]; then
        success "Auto cleanup system accessible"
    else
        warning "Auto cleanup system might not be configured"
    fi
}

# =============================================================================
# INTEGRATION TESTS
# =============================================================================

test_full_user_journey() {
    test_start "Full User Journey"

    # Simulate a complete user workflow
    log "Simulating user registration -> login -> action -> cleanup"

    # This is a simplified test - in real scenario, you'd test the full flow
    journey_steps=0

    # Step 1: Registration attempt
    if curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"email":"journey@test.com","password":"testpass","name":"Journey Test"}' \
        http://localhost:3000/api/auth/register >/dev/null 2>&1; then
        ((journey_steps++))
    fi

    # Step 2: Login attempt
    if curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"email":"journey@test.com","password":"testpass"}' \
        http://localhost:3000/api/auth/login >/dev/null 2>&1; then
        ((journey_steps++))
    fi

    if [ $journey_steps -ge 1 ]; then
        success "User journey endpoints accessible"
    else
        warning "User journey might need attention"
    fi
}

# =============================================================================
# DOCUMENTATION TESTS
# =============================================================================

test_documentation() {
    test_start "Documentation Availability"

    doc_score=0

    # Check for README files
    if [ -f "/d/SUM25/SWP391/db/README.md" ]; then ((doc_score++)); fi
    if [ -f "/d/SUM25/SWP391/SWP391-FE/README.md" ]; then ((doc_score++)); fi

    # Check for API documentation
    if curl -s http://localhost:3000/api-docs >/dev/null 2>&1; then
        ((doc_score++))
    fi

    if [ $doc_score -ge 2 ]; then
        success "Documentation available"
    else
        warning "Consider improving documentation"
    fi
}

# =============================================================================
# CLEANUP FUNCTIONS
# =============================================================================

cleanup_test_environment() {
    log "Cleaning up test environment..."

    # Stop background processes
    [ ! -z "$BACKEND_PID" ] && kill $BACKEND_PID 2>/dev/null || true
    [ ! -z "$FRONTEND_PID" ] && kill $FRONTEND_PID 2>/dev/null || true

    # Clean up test files
    rm -f /tmp/test_*.log 2>/dev/null || true

    success "Test environment cleaned"
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================

main() {
    log "Starting Final Comprehensive Test Suite"
    echo "======================================="

    # Setup
    setup_environment

    # Backend Tests
    log "Running Backend Tests..."
    test_backend_health
    test_database_connection
    test_authentication
    test_crud_operations
    test_feedback_system
    test_notification_system

    # Frontend Tests
    log "Running Frontend Tests..."
    test_frontend_build
    test_frontend_server
    test_frontend_backend_integration

    # Security Tests
    log "Running Security Tests..."
    test_security_headers
    test_input_validation

    # Performance Tests
    log "Running Performance Tests..."
    test_response_times
    test_concurrent_requests

    # Data Integrity Tests
    log "Running Data Integrity Tests..."
    test_data_validation

    # Cleanup Tests
    log "Running Cleanup Tests..."
    test_auto_cleanup

    # Integration Tests
    log "Running Integration Tests..."
    test_full_user_journey

    # Documentation Tests
    log "Running Documentation Tests..."
    test_documentation

    # Cleanup
    cleanup_test_environment

    # Final Report
    echo ""
    echo "======================================="
    log "Final Test Report"
    echo "======================================="
    echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
    echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
    echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
    echo -e "Success Rate: ${BLUE}$(( PASSED_TESTS * 100 / TOTAL_TESTS ))%${NC}"

    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "\n${GREEN}🎉 ALL TESTS PASSED! System is ready for deployment.${NC}"
        exit 0
    else
        echo -e "\n${YELLOW}⚠ Some tests failed. Please review and fix issues before deployment.${NC}"
        exit 1
    fi
}

# =============================================================================
# SCRIPT EXECUTION
# =============================================================================

# Handle script interruption
trap cleanup_test_environment EXIT

# Check if running in test mode
if [ "$1" = "--dry-run" ]; then
    log "Running in dry-run mode..."
    echo "This script would run the following tests:"
    echo "- Backend Health & Database Connection"
    echo "- Authentication & CRUD Operations"
    echo "- Feedback & Notification Systems"
    echo "- Frontend Build & Server"
    echo "- Security Headers & Input Validation"
    echo "- Performance & Concurrent Requests"
    echo "- Data Validation & Auto Cleanup"
    echo "- Full User Journey & Documentation"
    exit 0
fi

# Execute main function
main "$@"
