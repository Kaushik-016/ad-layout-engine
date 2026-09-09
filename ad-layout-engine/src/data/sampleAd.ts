import type { Ad } from '../types/ad'

export const sampleAd: Ad = {
  id: 'ad-1',
  name: 'Summer Sale Promo',
  elements: [
    {
      id: 'el-1',
      type: 'headline',
      content: 'Summer Sale — 50% Off',
      priority: 1,
      constraints: { minWidth: 100, minHeight: 30, lockAspectRatio: false, canHide: false },
    },
    {
      id: 'el-2',
      type: 'image',
      content: '/sample-product.jpg',
      priority: 2,
      constraints: { minWidth: 80, minHeight: 80, lockAspectRatio: true, canHide: false },
    },
    {
      id: 'el-3',
      type: 'subtext',
      content: 'Shop the collection before it ends.',
      priority: 3,
      constraints: { minWidth: 80, minHeight: 20, lockAspectRatio: false, canHide: true },
    },
    {
      id: 'el-4',
      type: 'cta',
      content: 'Shop Now',
      priority: 1,
      constraints: { minWidth: 60, minHeight: 25, lockAspectRatio: false, canHide: false },
    },
    {
      id: 'el-5',
      type: 'logo',
      content: '/logo.png',
      priority: 2,
      constraints: { minWidth: 30, minHeight: 30, lockAspectRatio: true, canHide: true },
    },
  ],
}