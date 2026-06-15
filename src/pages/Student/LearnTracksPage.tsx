import { useQueries } from "@tanstack/react-query"
import { fetchLanguageTrack } from "@/features/curriculum/api/curriculumClient"
import {
  TRACK_LANGUAGE_OPTIONS,
  isTrackLanguageAvailable,
} from "@/features/curriculum/ui/LangMini"
import TrackLanguageCard from "@/features/curriculum/ui/TrackLanguageCard"
import { queryKeys } from "@/shared/config/queryKeys"
import PageHeader from "@/shared/ui/PageHeader"

const AVAILABLE_TRACKS = TRACK_LANGUAGE_OPTIONS.filter((option) =>
  isTrackLanguageAvailable(option.id),
)

export default function LearnTracksPage() {
  const trackQueries = useQueries({
    queries: AVAILABLE_TRACKS.map((option) => ({
      queryKey: queryKeys.languageTrack(option.id),
      queryFn: () => fetchLanguageTrack(option.id),
    })),
  })

  return (
    <div className="py-6" data-testid="tracks-hub">
      <PageHeader
        title="Учебные треки"
        subtitle="Выберите язык — в каждом треке сборники идут по порядку, от простых конструкций к более сложным задачам."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {AVAILABLE_TRACKS.map((option, index) => {
          const query = trackQueries[index]
          return (
            <TrackLanguageCard
              key={option.id}
              option={option}
              track={query.data}
              isLoading={query.isLoading}
              error={query.isError}
            />
          )
        })}
      </div>
    </div>
  )
}
