-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(25) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "nickname" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255),
    "profile_image_url" TEXT,
    "role" VARCHAR(20) NOT NULL DEFAULT 'USER',
    "social_provider" VARCHAR(20) NOT NULL,
    "social_id" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_social_id_key" ON "users"("social_id");
