#!/bin/bash

# JD Optimizer - Cloudflare Pages Deployment Script
# This script automates the deployment process to Cloudflare Pages

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."

    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 20 or higher."
        exit 1
    fi

    # Check if pnpm is installed
    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm is not installed. Please install pnpm."
        exit 1
    fi

    # Check if wrangler is installed
    if ! command -v wrangler &> /dev/null; then
        print_warning "Wrangler is not installed. Installing..."
        npm install -g wrangler
    fi

    # Check if wrangler is authenticated
    if ! wrangler whoami &> /dev/null; then
        print_error "Not authenticated with Wrangler. Please run: wrangler login"
        exit 1
    fi

    print_info "Prerequisites check passed!"
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    pnpm install --frozen-lockfile
}

# Run tests
run_tests() {
    print_info "Running tests..."

    # Lint
    print_info "Running linter..."
    pnpm lint

    # Type check
    print_info "Running type check..."
    pnpm tsc --noEmit

    print_info "All tests passed!"
}

# Build application
build_application() {
    print_info "Building application..."

    # Check if .env file exists
    if [ ! -f .env ]; then
        print_warning ".env file not found. Using environment variables from Cloudflare."
    fi

    # Build Next.js app
    print_info "Building Next.js application..."
    pnpm build

    # Build for Cloudflare using OpenNext.js
    print_info "Building for Cloudflare Pages using OpenNext.js..."
    npx opennextjs-cloudflare build

    print_info "Build completed!"
}

# Deploy to Cloudflare Pages
deploy_to_cloudflare() {
    print_info "Deploying to Cloudflare Pages..."

    # Determine deployment environment
    ENVIRONMENT=${1:-production}

    if [ "$ENVIRONMENT" == "preview" ]; then
        PROJECT_NAME="jd-optimizer-preview"
        print_info "Deploying to PREVIEW environment..."
    else
        PROJECT_NAME="jd-optimizer"
        print_info "Deploying to PRODUCTION environment..."
    fi

    # Deploy using wrangler
    wrangler pages deploy .open-next --project-name=$PROJECT_NAME

    print_info "Deployment completed!"
}

# Verify deployment
verify_deployment() {
    ENVIRONMENT=${1:-production}

    if [ "$ENVIRONMENT" == "preview" ]; then
        URL="https://jd-optimizer-preview.pages.dev"
    else
        URL=$(grep NEXT_PUBLIC_APP_URL wrangler.toml | awk -F'"' '{print $2}')
    fi

    print_info "Verifying deployment at: $URL"

    # Check if URL is accessible (basic check)
    if command -v curl &> /dev/null; then
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $URL || echo "000")

        if [ "$HTTP_STATUS" == "200" ]; then
            print_info "✅ Deployment verified successfully!"
        else
            print_warning "⚠️  Deployment verification returned HTTP status: $HTTP_STATUS"
            print_warning "Please manually verify the deployment."
        fi
    else
        print_warning "curl is not available. Please manually verify the deployment."
    fi
}

# Rollback deployment
rollback_deployment() {
    ENVIRONMENT=${1:-production}

    if [ "$ENVIRONMENT" == "preview" ]; then
        PROJECT_NAME="jd-optimizer-preview"
    else
        PROJECT_NAME="jd-optimizer"
    fi

    print_warning "Rolling back deployment for project: $PROJECT_NAME"
    wrangler pages deployment rollback --project-name=$PROJECT_NAME
    print_info "Rollback completed!"
}

# Main script
main() {
    print_info "=========================================="
    print_info "JD Optimizer - Deployment Script"
    print_info "=========================================="

    # Parse command line arguments
    COMMAND=${1:-deploy}
    ENVIRONMENT=${2:-production}

    case $COMMAND in
        "deploy")
            check_prerequisites
            install_dependencies
            run_tests
            build_application
            deploy_to_cloudflare $ENVIRONMENT
            verify_deployment $ENVIRONMENT
            ;;
        "quick")
            print_info "Quick deployment (skipping tests)..."
            check_prerequisites
            build_application
            deploy_to_cloudflare $ENVIRONMENT
            verify_deployment $ENVIRONMENT
            ;;
        "preview")
            print_info "Deploying to preview environment..."
            check_prerequisites
            install_dependencies
            run_tests
            build_application
            deploy_to_cloudflare preview
            verify_deployment preview
            ;;
        "rollback")
            rollback_deployment $ENVIRONMENT
            ;;
        "verify")
            verify_deployment $ENVIRONMENT
            ;;
        *)
            echo "Usage: $0 {deploy|quick|preview|rollback|verify} [production|preview]"
            echo ""
            echo "Commands:"
            echo "  deploy    - Full deployment with tests (default)"
            echo "  quick     - Quick deployment without tests"
            echo "  preview   - Deploy to preview environment"
            echo "  rollback  - Rollback to previous deployment"
            echo "  verify    - Verify deployment status"
            echo ""
            echo "Environment (default: production):"
            echo "  production - Deploy to production"
            echo "  preview    - Deploy to preview"
            exit 1
            ;;
    esac

    print_info "=========================================="
    print_info "Script completed successfully!"
    print_info "=========================================="
}

# Run main function
main "$@"
