import { Box, Skeleton } from "@mui/material";

const MatchListSkeleton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 2,
        p: 2,
      }}
    >
      {/* Скелетон для фильтров */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          width: "100%",
          maxWidth: "800px",
          justifyContent: "center",
        }}
      >
        {[...Array(4)].map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width={120}
            height={40}
            sx={{ borderRadius: 1 }}
          />
        ))}
      </Box>

      {/* Скелетон для списка матчей */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {[...Array(3)].map((_, sportIndex) => (
          <Box key={sportIndex} sx={{ mb: 3 }}>
            {/* Заголовок вида спорта */}
            <Skeleton
              variant="text"
              width={150}
              height={32}
              sx={{ mb: 2, mx: 1 }}
            />

            {/* Список матчей */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[...Array(2)].map((_, matchIndex) => (
                <Box
                  key={matchIndex}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  {/* Дата и время */}
                  <Box sx={{ minWidth: 100 }}>
                    <Skeleton variant="text" width={80} height={20} />
                    <Skeleton variant="text" width={60} height={16} />
                  </Box>

                  {/* Команды */}
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                    }}
                  >
                    <Skeleton variant="text" width="80%" height={24} />
                    <Skeleton variant="text" width="70%" height={24} />
                  </Box>

                  {/* Счет или статус */}
                  <Box
                    sx={{
                      minWidth: 80,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Skeleton variant="rounded" width={60} height={32} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MatchListSkeleton;
