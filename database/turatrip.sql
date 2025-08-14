-- =============================================
-- TURA TRIP DATABASE SCHEMA - FINAL VERSION
-- =============================================

CREATE DATABASE IF NOT EXISTS tura_trip CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tura_trip;

-- =============================================
-- 1. CITIES TABLE
-- =============================================
CREATE TABLE cities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_active (is_active)
);


-- Add city translations table
CREATE TABLE city_translations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    city_id INT NOT NULL,
    language_code ENUM('en', 'ru', 'it', 'de') NOT NULL,
    name VARCHAR(100) NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
    UNIQUE KEY unique_city_language (city_id, language_code),
    
    INDEX idx_city_lang (city_id, language_code)
);

-- =============================================
-- 2. TOUR CATEGORIES TABLE
-- =============================================
CREATE TABLE tour_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_active (is_active)
);

-- Add tour category translations table
CREATE TABLE tour_category_translations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    language_code ENUM('en', 'ru', 'it', 'de') NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    FOREIGN KEY (category_id) REFERENCES tour_categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_category_language (category_id, language_code),
    
    INDEX idx_category_lang (category_id, language_code)
);


-- =============================================
-- 3. TOURS TABLE (MAIN)
-- =============================================
CREATE TABLE tours (
    id INT PRIMARY KEY AUTO_INCREMENT,
    city_id INT NOT NULL,
    category_id INT NOT NULL,
    location VARCHAR(255),
    price_adult DECIMAL(10,2) NOT NULL,
    price_child DECIMAL(10,2) NOT NULL,
    featured_tag ENUM('popular', 'great_value', 'new') NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    status ENUM('active', 'inactive', 'draft') DEFAULT 'active',
    views INT DEFAULT 0,
    cover_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES tour_categories(id) ON DELETE CASCADE,
    
    INDEX idx_city (city_id),
    INDEX idx_category (category_id),
    INDEX idx_featured (featured_tag),
    INDEX idx_status (status),
    INDEX idx_price_adult (price_adult)
);

-- =============================================
-- 4. TOUR CONTENT (MULTI-LANGUAGE)
-- =============================================
CREATE TABLE tour_content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tour_id INT NOT NULL,
    language_code ENUM('en', 'ru', 'it', 'de') NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    duration VARCHAR(100),
    availability VARCHAR(255),
    description TEXT,
    included JSON,
    not_included JSON,
    trip_program JSON,
    take_with_you JSON,
    
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tour_language (tour_id, language_code),
    
    INDEX idx_tour_lang (tour_id, language_code)
);

-- =============================================
-- 5. TOUR IMAGES TABLE
-- =============================================
CREATE TABLE tour_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tour_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
    
    INDEX idx_tour (tour_id)
);

-- =============================================
-- 6. FAQS TABLE
-- =============================================
CREATE TABLE faqs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_active (is_active),
    INDEX idx_order (display_order)
);

CREATE TABLE faq_translations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    faq_id INT NOT NULL,
    language_code ENUM('en', 'ru', 'it', 'de') NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    
    FOREIGN KEY (faq_id) REFERENCES faqs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_faq_language (faq_id, language_code),
    
    INDEX idx_faq_lang (faq_id, language_code)
);


-- =============================================
-- 7. REVIEWS TABLE
-- =============================================
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tour_id INT NOT NULL,
    client_name VARCHAR(100) NOT NULL,
    rating TINYINT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    tour_name VARCHAR(255),
    review_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
    
    INDEX idx_tour (tour_id),
    INDEX idx_rating (rating),
    INDEX idx_active (is_active),
    INDEX idx_date (review_date)
);

-- Update customer reviews table for tours
ALTER TABLE reviews 
ADD COLUMN client_image VARCHAR(255) NULL AFTER client_name,
ADD COLUMN profile_image VARCHAR(255) NULL AFTER client_image;



-- Create promotional reviews with multi-language support
CREATE TABLE promotional_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_name VARCHAR(100) NOT NULL, -- Same name for all languages
    screenshot_image VARCHAR(255) NULL, -- Common screenshot
    review_date DATE NOT NULL, -- Common date
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_active (is_active),
    INDEX idx_order (display_order),
    INDEX idx_date (review_date)
);

CREATE TABLE promotional_review_translations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    review_id INT NOT NULL,
    language_code ENUM('en', 'ru', 'it', 'de') NOT NULL,
    review_text TEXT NOT NULL,
    
    FOREIGN KEY (review_id) REFERENCES promotional_reviews(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review_language (review_id, language_code),
    
    INDEX idx_review_lang (review_id, language_code)
);

-- =============================================
-- 8. ADMIN USERS TABLE
-- =============================================
CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_admin_id (admin_id),
    INDEX idx_email (email),
    INDEX idx_active (is_active)
);

-- =============================================
-- 9. CURRENCIES TABLE
-- =============================================
CREATE TABLE currencies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(3) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    symbol VARCHAR(5) NOT NULL,
    exchange_rate DECIMAL(15,6) NOT NULL DEFAULT 1.000000,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_code (code),
    INDEX idx_active (is_active)
);

-- =============================================
-- 10. ORGANIZER COMMISSION TABLE
-- =============================================
CREATE TABLE organizer_commission (
    id INT PRIMARY KEY AUTO_INCREMENT,
    currency_code VARCHAR(3) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (currency_code) REFERENCES currencies(code) ON DELETE CASCADE,
    UNIQUE KEY unique_currency (currency_code),
    
    INDEX idx_currency (currency_code),
    INDEX idx_active (is_active)
);

CREATE TABLE password_resets (
  admin_id INT PRIMARY KEY,
  verification_code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

-- =============================================
-- CITY-CATEGORY RELATIONSHIP TABLE (Many-to-Many)
-- =============================================
CREATE TABLE city_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    city_id INT NOT NULL,
    category_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES tour_categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_city_category (city_id, category_id),
    
    INDEX idx_city (city_id),
    INDEX idx_category (category_id),
    INDEX idx_active (is_active)
);

-- Add to your database schema
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('review', 'comment', 'booking', 'system') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_id INT NULL,
    related_type ENUM('tour', 'review', 'booking') NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_read_created (is_read, created_at),
    INDEX idx_type (type)
);