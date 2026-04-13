export * from './admin.mutation';
export * from './adminFarmCategory.mutation';
export {
	useGetMilestones,
	useGetMilestones as useGetAdminMilestones,
	useGetMilestonesByCategory,
	useGetMilestonesByCategory as useGetAdminMilestonesByCategory,
	useCreateMilestone,
	useUpdateMilestone,
	useDeleteMilestone,
	useDeleteAllMilestonesByCategory,
} from './adminMilestones.mutation';
export * from './auth.mutation';
export {
	useGetFarmCategories,
	useGetMilestonesByCategory as useGetWebMilestonesByCategory,
	useGetDashboard,
	useGetDashboardStats,
} from './dashboard.mutation';
export * from './farms.mutation';
export * from './kyc.mutation';